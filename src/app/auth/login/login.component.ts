import { Component } from '@angular/core';
import {  Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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



// MOT DE PASSE OUBLIE

this.resetPasswordForm = this.fb.group(
      {
        code: ['', Validators.required],
        newResetPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );


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






  
// renitialiser mot de passe
 resetPasswordForm: FormGroup;


  /* --- VALIDATEUR --- */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pwd = group.get('newResetPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  /* --- GETTERS PRATIQUES --- */
  get code() {
    return this.resetPasswordForm.get('code')!;
  }
  get newResetPassword() {
    return this.resetPasswordForm.get('newResetPassword')!;
  }
  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword')!;
  }



onSubmit2() {
    if (this.resetPasswordForm.valid) {
      console.log('Formulaire soumis', this.resetPasswordForm.value);
      // Appelle ton service ici pour réinitialiser le mot de passe
    }
  }
}
