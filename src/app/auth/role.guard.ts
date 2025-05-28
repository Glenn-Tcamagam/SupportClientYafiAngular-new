// src/app/auth/role.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const expectedRole = route.data['expectedRole'];
    const actualRole = this.auth.getRole();

    if (actualRole === expectedRole) {
      return true;
    }

    // Redirection si mauvais rôle
    this.router.navigate(['/login']);
    return false;
  }
}
