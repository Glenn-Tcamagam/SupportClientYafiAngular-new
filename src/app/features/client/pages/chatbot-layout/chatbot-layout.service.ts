import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotLayoutService {

  constructor(private http: HttpClient) {}

  detectIntent(message: string): Observable<any> {
    return this.http.post<any>('http://localhost:5005/model/parse', {
      text: message
    });
  }

  createTicket(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>('http://localhost:8000/api/tickets/create/', payload, { headers });
  }
}
