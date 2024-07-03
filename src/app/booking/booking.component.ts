import { Component, OnInit } from '@angular/core';
//import { Router } from '@angular/router';
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
  

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.generateDaysInMonth();
    this.getMonth();
    this.getLocalStorageData();
  }

  //Create a method that gets the local storage data and returns it to the console
  getLocalStorageData() {
    const token = localStorage.getItem('token');
    console.log('Välkommen:', token);
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
    this.selectedParking = parking;
  }


onSelect(value: string) {
    console.log("Valt parkeringsnummer:", value);
    // Hantera valt värde här (t.ex. uppdatera en modell eller göra en förfrågan)
}

    logout() {
    (['/']);
  }

   
  async generateDaysInMonth(year: number = new Date().getFullYear(), month: number = new Date().getMonth()) {
    this.daysInMonth = [];
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to the start of the day for comparison
    let date = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of the month
    const monthString = `${year}-${(month + 1).toString().padStart(2, '0')}`; // Format month string as YYYY-MM
  
    try {
      const bookings = await this.bookingService.getBookingsByMonth(monthString).toPromise(); // Convert Observable to Promise
      const bookingDates = new Set(bookings.map((booking: { date: string; }) => booking.date.split('T')[0])); // Assume each booking has a 'date' property and extract the date part
  
      while (date.getMonth() === month) {
        const dateString = date.toISOString().split('T')[0];
        const isSelectable = date >= today && !bookingDates.has(dateString); // Check if the date is today or in the future and not booked
        this.daysInMonth.push({ date: date.getDate(), isSelectable });
        date.setDate(date.getDate() + 1);
      }
    } catch (error) {
      console.error('Error fetching bookings for month:', error);
    }
  }
  
  getMonth(): string {
    return this.currentDate.toLocaleString('sv-SE', { month: 'long' });
  }

  goToNextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
  }

  goToPreviousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
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
