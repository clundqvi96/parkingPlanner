import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  daysInMonth: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.generateDaysInMonth();
    this.getMonth();
  }

  generateDaysInMonth(year: number = new Date().getFullYear(), month: number = new Date().getMonth()) {
    this.daysInMonth = [];
    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      this.daysInMonth.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
  }
  // Add the following method that gets curerent month and return it as string and converts it to swedish. the first letter is capitalized.
  getMonth() {
    const month = new Date().toLocaleString('sv-SE', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1);
  }
}
