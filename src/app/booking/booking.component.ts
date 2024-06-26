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
  selectedDate: number | null = null;
  isSelectedDateSpecial: boolean = false;
  currentDate: Date = new Date();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.generateDaysInMonth();
    this.getMonth();
  }

 
  selectDay(day: number) {
    this.selectedDate = day;
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
