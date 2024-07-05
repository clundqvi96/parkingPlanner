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
  bookings: any[] = [];
  formattedMonth: string = '';
  bookedParkings: string[] = [];
 parkings: any[] = [
  { parkingNumber: '61', isDisabled: false },
  { parkingNumber: '101', isDisabled: false },
  { parkingNumber: '105', isDisabled: false },
  { parkingNumber: '102', isDisabled: false },
];
  availableParkings: string[] = [];
  isButtonDisabled: boolean = true;
  
 
  constructor(private bookingService: BookingService, private router: Router) { }

  ngOnInit(): void {
    this.updateFormattedMonth();
    this.getMonth();
    this.getLocalStorageData();
    this.loadBookingsForMonth(this.formattedMonth); 
    this.generateDaysInMonth();
    
  }
  updateFormattedMonth(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1; 
    this.formattedMonth = `${year}-${month < 10 ? '0' + month : month}`;
  }

  loadBookingsForMonth(month: string) {
    this.bookings = [];

    this.bookingService.getBookingsByMonth(month).subscribe({
      next: (data) => {
        // Kontrollera om data är tom och hantera det genom att sätta bookings till en tom array
        if (data && data.length > 0) {
          this.bookings = data;
        } else {
          this.bookings = [];
          console.log('Inga bokningar hittades för den här månaden.');
        }
      },
      error: (error) => console.error('Det gick inte att hämta bokningar', error),
    });
  }

  getLocalStorageData() {
    this.token = localStorage.getItem('token');
    console.log('Välkommen:', this.token);
  }

 
selectDay(day: number) {
  this.currentDate.setDate(day);
  const year = this.currentDate.getFullYear();
  const month = this.currentDate.getMonth(); // Använd getMonth direkt för jämförelse
  const date = this.currentDate.getDate();
  this.selectedDate = `${year}-${month + 1}-${date}`;

  const filteredBookings = this.bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getFullYear() === year &&
           bookingDate.getMonth() === month &&
           bookingDate.getDate() === date;
  });

  this.updateParkingAvailability(this.selectedDate);
}

updateParkingAvailability(selectedDate: string) {
  // Använd `this.selectedDate` direkt för att filtrera bokningar
  const [year, month, day] = selectedDate.split('-').map(Number);
  const bookingsForSelectedDay = this.bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getFullYear() === year &&
           bookingDate.getMonth() === month - 1 && // Månader är 0-indexerade i JavaScript Date
           bookingDate.getDate() === day;
  });

  // Hämta upptagna parkeringsnummer som strängar för den valda dagen
  const occupiedParkingNumbers = this.getParkingNumbers(bookingsForSelectedDay);

  // Uppdatera `isDisabled` för varje parkeringsplats baserat på om dess nummer finns i `occupiedParkingNumbers`
  this.parkings.forEach(parking => {
    parking.isDisabled = occupiedParkingNumbers.includes(parking.parkingNumber.toString());
  });

  console.log("Upptagna parkeringsnummer för vald dag:", occupiedParkingNumbers);
}

 getParkingNumbers(bookings: any[]): number[] {
  return bookings.map(booking => booking.parking.parkingNumber.toString());
}
  isSelectedDate(day: number): boolean {
    if (this.selectedDate === null) {
      return false;
    }

    const year = this.currentDate.getFullYear();
    const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
   
    const date = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    if (typeof this.selectedDate === 'string') {
      return this.selectedDate === formattedDate;
    }
    return false;
  }

  selectParking(parking: string): void { 
    this.selectedParking = parking;
    console.log("Vald parkering:", this.selectedParking);
  }


onSelect(value: string) {
    console.log("Valt parkeringsnummer:", value);
    
}
  logout() {
    localStorage.clear(); 
    this.router.navigate(['/']); 
}

async generateDaysInMonth(year: number = new Date().getFullYear(), month: number = new Date().getMonth()) {
  this.daysInMonth = [];
  const monthString = `${year}-${(month + 1).toString().padStart(2, '0')}`;

  // Generera alla dagar i månaden som standardinställning
  let date = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  while (date <= endDate) {
    this.daysInMonth.push({ date: date.getDate(), isSelectable: true }); // Standardinställ alla dagar till valbara
    date.setDate(date.getDate() + 1);
  }

  try {
    const bookings = await this.bookingService.getBookingsByMonth(monthString).toPromise();
    if (bookings && bookings.length > 0) {
      let bookingCounts: { [key: string]: number } = {};

      // Skapa en reducer som räknar bokningar per dag
      bookingCounts = bookings.reduce((acc: { [x: string]: number; }, { date }: any) => {
        const dateString = date.split('T')[0];
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
      }, {});

      // Uppdatera isSelectable baserat på bokningar
      this.daysInMonth = this.daysInMonth.map(day => {
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.date.toString().padStart(2, '0')}`;
        const isSelectable = !(dateString in bookingCounts) || bookingCounts[dateString] < 4;
        return { ...day, isSelectable };
      });
    }
  } catch (error) {
    console.error('Error fetching bookings for month:', error);
  }
}
goToNextMonth(): void {
  this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  this.generateDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
  this.updateFormattedMonth();
  this.loadBookingsForMonth(this.formattedMonth);
}
goToPreviousMonth(): void {
  this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  this.generateDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
  this.updateFormattedMonth();
  this.loadBookingsForMonth(this.formattedMonth);
}
getMonth(): string {
  return this.currentDate.toLocaleString('sv-SE', { month: 'long' });
}
  bookParking(): void {
    let selectedDay = this.daysInMonth.find(day => day.date === Number(this.selectedDate));
  
    if (!this.selectedParking || !this.selectedDate || (selectedDay && !selectedDay.isSelectable)) {
      alert('Vänligen välj både en parkering och ett giltigt datum.');
      return;
    }
    const confirmationMessage = `Bekräfta din bokning:\nParkering: ${this.selectedParking}\nDatum: ${this.selectedDate}`;
    const isConfirmed = window.confirm(confirmationMessage);
    if (isConfirmed) {
      console.log(`Bokningen genomförd för parkering ${this.selectedParking} på datum ${this.selectedDate}.`);
      alert('Din bokning är genomförd!');
    }
  }
}
