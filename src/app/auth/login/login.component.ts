import { Component } from '@angular/core';
import {  Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {



  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,private router:Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => console.log('Login réussi'),
        error: err => alert('Identifiants invalides !')
      });
    }
  }

  navigateToRegister(){
    this.router.navigate(['/auth/register'])
  }
}
