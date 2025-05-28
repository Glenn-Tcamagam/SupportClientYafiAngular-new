import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  baseUrl: any;
  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get('http://localhost:8000/api/utilisateurs/me/');
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      old_password: oldPassword,
      new_password: newPassword
    };
    return this.http.post('http://localhost:8000/api/utilisateurs/change_password/', body);
  }

  getAgents(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/utilisateurs/?role=agent');
  }

  createAgent(agentData: any): Observable<any> {
    agentData.role = 'agent';  // Forçage du rôle côté frontend
    return this.http.post('http://localhost:8000/api/utilisateurs/', agentData);
  }

  updateAgent(id: number, data: any): Observable<any> {
    return this.http.patch(`http://localhost:8000/api/utilisateurs/${id}/`, data);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/utilisateurs/${id}/`);
  }

  getAllTickets(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/tickets/');
  }

  getAgentStats(agentId: number, month: number, year: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`http://localhost:8000/api/admin/agent-stats/${agentId}/?month=${month}&year=${year}`, { headers });
  }

  getGlobalStats(year: number) {
    return this.http.get<any>(`http://localhost:8000/api/admin/global-stats/`, {
      params: { year: year.toString() }
    });
  }

  getAgentsReport(month: number, year: number): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`http://localhost:8000/api/admin/rapport-agents/`, {
      headers,
      params: {
        month: month.toString(),
        year: year.toString()
      }
    });
  }
}
