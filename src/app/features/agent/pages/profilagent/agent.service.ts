import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/utilisateurs/me/`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      old_password: oldPassword,
      new_password: newPassword
    };
    return this.http.post(`${this.baseUrl}/utilisateurs/change_password/`, body);
  }

  /** ✅ Liste des tickets de l’agent connecté */
  getMesTickets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/agent/`);
  }

  /** 🔁 Modifier le statut d’un ticket */
  changerStatutTicket(ticketId: number, nouveauStatut: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/tickets/${ticketId}/changer-statut/`, {
      statut: nouveauStatut
    });
  }

  getAgentDashboardStats(year: number) {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/agent/dashboard/?year=${year}`, { headers });
}



}
