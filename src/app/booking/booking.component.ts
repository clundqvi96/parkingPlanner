import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.generateDaysInMonth();
    this.getMonth();
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
    this.router.navigate(['/']);
  }

  generateDaysInMonth(year: number = new Date().getFullYear(), month: number = new Date().getMonth()) {
    this.daysInMonth = [];
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Nollställ tid till början av dagen för jämförelse
    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      const isSelectable = date >= today; // Kontrollera om datumet är idag eller i framtiden
      this.daysInMonth.push({ date: date.getDate(), isSelectable });
      date.setDate(date.getDate() + 1);
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
