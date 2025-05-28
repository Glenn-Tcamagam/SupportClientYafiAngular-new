// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginUrl = 'http://localhost:8000/api/token/';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('role', res.role);  // ✅ stocker le rôle

        // ✅ Redirection dynamique
        if (res.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.role === 'agent') {
          this.router.navigate(['/agent/dashboard']);
        } else {
          this.router.navigate(['/client/home']);
        }
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
