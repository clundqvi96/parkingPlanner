import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import e from 'express';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})

export class BookingComponent implements OnInit {
  selectedRowIndex: number = -1;
  showDeleteButton = false;
  selectedBookingName: string | null = null;
  daysInMonth: { date: number, isBookable: boolean, isFull: boolean, isPast: boolean}[] = [];
  selectedParkingNumber: string = '';
  selectedDate: string = '';
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
  selectedBooking: any = null;

  constructor(private bookingService: BookingService, private router: Router) { }

  ngOnInit(): void {
    this.updateFormattedMonth();
    this.getMonth();
    this.getLocalStorageData();
    this.loadBookingsForMonth(this.formattedMonth);
    this.generateDaysInMonth();
  }

  getLocalStorageData() {
    this.token = localStorage.getItem('token');
    console.log('Välkommen:', this.token);
  }


  updateFormattedMonth(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    this.formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
  }

  loadBookingsForMonth(month: string) {
    this.bookingService.getBookingsByMonth(month).subscribe({
      next: (data) => {
        this.bookings = data || [];
        if (this.bookings.length === 0) {
          console.log('Inga bokningar hittades för den här månaden.');
        }
      },
      error: (error) => console.error('Det gick inte att hämta bokningar', error),
    });
  }
  loadBookingsForDate(date: string) {
    this.bookingService.getBookingsByDate(date).subscribe({
      next: (data) => {
        console.log("innan if satsen");
        // Kontrollera om svaret innehåller ett meddelande, vilket indikerar inga bokningar
        if (data.message) {
          console.log(data.message); // Logga meddelandet från servern
          this.bookings = data.bookings; // Sätt bookings till den tomma arrayen
        } else {
          this.bookings = data;
        }
      },
      error: (error) => console.error('Det gick inte att hämta bokningar', error),
    });
  }

  selectDay(day: number) {
    this.currentDate.setDate(day);
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const date = this.currentDate.getDate();
    this.selectedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    console.log("Valt datum:", this.selectedDate);
    

    const filteredBookings = this.bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.getFullYear() === year && bookingDate.getMonth() === month && bookingDate.getDate() === date;
    });
    
    this.updateParkingAvailability(this.selectedDate);
    this.loadBookingsForDate(this.selectedDate);
    
  }
  updateParkingAvailability(selectedDate: string) {
    console.log("Valt datum i updateParkingAvailability:", selectedDate);
    const [year, month, day] = selectedDate.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day).setHours(0, 0, 0, 0);
  
    this.bookingService.getBookingsByDate(selectedDate).subscribe({
      next: (response) => {
        // Kontrollera om svaret innehåller en bookings-array
        const bookingsData = response.bookings ? response.bookings : response;
        const bookingsForSelectedDay = bookingsData.filter((booking: any) => {
          const bookingDate = new Date(booking.date).setHours(0, 0, 0, 0);
          return bookingDate === targetDate;
        });
        console.log("Bokningar för vald dag:", bookingsForSelectedDay);
  
        const occupiedParkingNumbers = bookingsForSelectedDay.map((booking: any) => booking.parking.parkingNumber.toString());
        console.log("Upptagna parkeringsnummer för vald dag:", occupiedParkingNumbers);
        if (occupiedParkingNumbers.includes(this.selectedParkingNumber)) {
          console.log(`Parkering ${this.selectedParkingNumber} är upptagen den ${selectedDate}.`);
          this.isButtonDisabled = true;
        }
        this.parkings.forEach(parking => {
          parking.isDisabled = occupiedParkingNumbers.includes(parking.parkingNumber.toString());
        });
      },
      error: (error) => console.error('Det gick inte att hämta bokningar', error),
    });
  }

  isSelectedDate(day: number): boolean {
    if (this.selectedDate === null) {
      return false;
    }

    const year = this.currentDate.getFullYear();
    const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
    const date = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    return typeof this.selectedDate === 'string' && this.selectedDate === formattedDate;
  }

  selectParking(parkingNumber: string): void {
    console.log("Vald parkering:", this.selectedParkingNumber);
    this.selectedParkingNumber = this.selectedParkingNumber === parkingNumber ? '' : parkingNumber;
    console.log("Vald parkering:", parkingNumber);
  }

  isSelectedParking(parkingNumber: string): boolean {
    return this.selectedParkingNumber === parkingNumber;
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthString = `${year}-${(month + 1).toString().padStart(2, '0')}`;

    let date = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    while (date <= endDate) {
      const isPast = date < today;
      this.daysInMonth.push({
        date: date.getDate(),
        isBookable: true,
        isFull: false,
        isPast: isPast
      });
      date.setDate(date.getDate() + 1);
    }

  try {
  const bookings = await this.bookingService.getBookingsByMonth(monthString).toPromise();
  if (bookings && bookings.length > 0) {
    const bookingCounts = bookings.reduce((acc: { [key: string]: number }, { date }: { date: string }) => {
      const dateString = date.split('T')[0];
      acc[dateString] = (acc[dateString] || 0) + 1;
      return acc;
    }, {});

    this.daysInMonth = this.daysInMonth.map(day => {
      const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.date.toString().padStart(2, '0')}`;
      day.isFull = (dateString in bookingCounts) && bookingCounts[dateString] >= 4;
      return day;
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
    const selectedDay = this.daysInMonth.find(day => day.date === Number(this.selectedDate));
  
    if (!this.selectedParkingNumber || !this.selectedDate || (selectedDay && !selectedDay.isBookable)) {
      alert('Vänligen välj både en parkering och ett giltigt datum.');
      return;
    }
  
    const bookingData = {
      parkingNumber: this.selectedParkingNumber,
      date: this.selectedDate,
      name: this.token || ''
    };
  
    const confirmationMessage = `Bekräfta din bokning:\nNamn: ${bookingData.name}\nParkering: ${bookingData.parkingNumber}\nDatum: ${bookingData.date}`;
    const isConfirmed = window.confirm(confirmationMessage);
  
    if (isConfirmed) {
      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          console.log(`Bokningen genomförd för parkering ${this.selectedParkingNumber} på datum ${this.selectedDate}.`, response);
          alert('Din bokning är genomförd!');
        },
        error: (error) => {
          console.error('Det gick inte att genomföra bokningen', error);
          alert('Ett fel uppstod. Din bokning kunde inte genomföras.');
        }
      });
    }
  }
  confirmDelete() {
    const isConfirmed = confirm('Är du säker på att du vill ta bort denna bokning?');
    if (isConfirmed && this.selectedBooking) {
        // Använd data från den valda bokningen istället
        console.log('Bokning att ta bort:', this.selectedBooking);
        this.bookingService.deleteBooking({ parkingNumber: this.selectedBooking.parking.parkingNumber, date: this.selectedDate, name: this.token ?? '' }).subscribe({
          next: (response) => {
            console.log('Bokningen har tagits bort:', response);
            this.loadBookingsForDate(this.selectedBooking.date);
            // Nollställ den valda bokningen efter borttagning
            this.selectedBooking = null;
          },
          error: (error) => {
            console.error('Det gick inte att ta bort bokningen:', error);
          }
        });
    }
  }

selectRow(booking: any, index: number): void {
  if (booking.employee.name !== this.token) {
    return;
  }
  this.selectedRowIndex = index;
  this.showDeleteButton = true;
  // Spara den valda bokningen
  this.selectedBooking = booking;
}
}
