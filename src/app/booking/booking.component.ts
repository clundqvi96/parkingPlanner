import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  daysInMonth: { date: number, isSelectable: boolean }[] = [];
  selectedParking: string = '';
  selectedDate: string | null = null;
  isSelectedDateSpecial: boolean = false;
  currentDate: Date = new Date();
  token = localStorage.getItem('token');
  

  constructor(private bookingService: BookingService, private router: Router) { }

  ngOnInit(): void {
    this.generateDaysInMonth();
    this.getMonth();
    this.getLocalStorageData();
  }

  //Create a method that gets the local storage data and returns it to the console
  getLocalStorageData() {
    this.token = localStorage.getItem('token');
    console.log('Välkommen:', this.token);
  }

 
  selectDay(day: number) {
    this.currentDate.setDate(day);
    const year = this.currentDate.getFullYear();
    // Ensuring month and day are two digits
    const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
    const date = this.currentDate.getDate().toString().padStart(2, '0');
    this.selectedDate = `${year}-${month}-${date}`;
    console.log("Valt datum:", this.selectedDate), this.selectParking(this.selectedParking);
  }

  isSelectedDate(day: number): boolean {
    if (this.selectedDate === null) {
      return false;
    }
    const year = this.currentDate.getFullYear();
    const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
    // Ensure the day is two digits for comparison
    const date = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    if (typeof this.selectedDate === 'string') {
      return this.selectedDate === formattedDate;
    }
    return false;
  }

  selectParking(parking: string): void { // Added explicit return type
    console.log("Vald parkering:", parking);
    this.selectedParking = parking;
    
    if (this.selectedDate !== null) {
      const bookings = this.bookingService.getBookingsByDate(this.selectedDate);
      // Log the bookings for the selected date
      bookings.pipe(
        catchError(error => {
          console.error('Error fetching bookings:', error);
          return of([]);
        })
      ).subscribe((data: any[]) => {
        console.log(`Bokningar för datum ${this.selectedDate}:`, data);
      });
    }
  }


onSelect(value: string) {
    console.log("Valt parkeringsnummer:", value);
    // Hantera valt värde här (t.ex. uppdatera en modell eller göra en förfrågan)
}

  logout() {
    localStorage.clear(); // Clear user session
    this.router.navigate(['/']); // Navigate back to the first page
}

   
async generateDaysInMonth(year: number = new Date().getFullYear(), month: number = new Date().getMonth()) {
  this.daysInMonth = [];
  const monthString = `${year}-${(month + 1).toString().padStart(2, '0')}`; // Format month string as YYYY-MM

  try {
    const bookings = await this.bookingService.getBookingsByMonth(monthString).toPromise(); // Convert Observable to Promise
    let bookingCounts: { [key: string]: number } = {};
    if (bookings.length > 0) {
      // Create an object to count bookings per date only if there are bookings
      bookingCounts = bookings.reduce((acc: { [x: string]: number; }, { date }: any) => {
        // Assuming date is in local time and formatted as 'YYYY-MM-DD'
        const dateString = date.split('T')[0];
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
      }, {});
    }

    let date = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of the month

    while (date <= endDate) {
      // Manually construct the date string to ensure it represents local time
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      // A date is selectable if it has less than 4 bookings or if there are no bookings at all
      const isSelectable = (bookingCounts[dateString] || 0) < 4;
      this.daysInMonth.push({ date: date.getDate(), isSelectable });
      date.setDate(date.getDate() + 1);
    }
  } catch (error) {
    console.error('Error fetching bookings for month:', error);
  }
}

goToNextMonth(): void {
  this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  this.generateDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
}

goToPreviousMonth(): void {
  this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  this.generateDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
}

getMonth(): string {
  return this.currentDate.toLocaleString('sv-SE', { month: 'long' });
}
  bookParking(): void {
    // Find the selected day object
    let selectedDay = this.daysInMonth.find(day => day.date === Number(this.selectedDate));
  
    // Validate both parking and date selection, and ensure the date is selectable
    if (!this.selectedParking || !this.selectedDate || (selectedDay && !selectedDay.isSelectable)) {
      alert('Vänligen välj både en parkering och ett giltigt datum.');
      return;
    }
  
    // Confirm booking with the user
    const confirmationMessage = `Bekräfta din bokning:\nParkering: ${this.selectedParking}\nDatum: ${this.selectedDate}`;
    const isConfirmed = window.confirm(confirmationMessage);
  
    if (isConfirmed) {
      // Placeholder for booking logic - assuming a simple console log for demonstration
      console.log(`Bokningen genomförd för parkering ${this.selectedParking} på datum ${this.selectedDate}.`);
      alert('Din bokning är genomförd!');
    }
  }
}
