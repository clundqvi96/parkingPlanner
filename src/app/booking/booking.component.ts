import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  daysInMonth: number[] = [];
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
    console.log("Valt datum:", this.selectedDate);
  }

  isSelectedDate(day: number): boolean {
    const year = this.currentDate.getFullYear();
    const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
    // Ensure the day is two digits for comparison
    const date = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    return this.selectedDate === formattedDate;
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
    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      this.daysInMonth.push(date.getDate());
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
}
