import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) { }

  // Get bookings by date
  getBookingsByDate(date: string): Observable<any> {
    
    return this.http.get(`${this.baseUrl}/date/${date}`);
  }

  // Get bookings by month
  getBookingsByMonth(month: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/month/${month}`);
  }

  // Lägg till fler metoder för att hantera andra endpoints, som att skapa en bokning, uppdatera, etc.
}
