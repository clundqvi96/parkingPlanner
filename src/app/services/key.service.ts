import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  private baseUrl = 'http://localhost:3000/api/keys/v2';

  constructor(private http: HttpClient) { }

  // Get a key by its ID
  getKeyById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new key
  createKey(keyData: { type: string; accessLevel: number }): Observable<any> {
    return this.http.post(this.baseUrl, keyData);
  }

  // Update a key
  updateKey(id: string, keyData: { type?: string; accessLevel?: number }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, keyData);
  }

  // Delete a key by its ID
  deleteKey(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}