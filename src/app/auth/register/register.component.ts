import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommaExpr } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup ;
  submitted = false;
  showPassword = false;

  errorMessage = '';
  successMessage = '';

  constructor(private router:Router, private fb: FormBuilder, private http: HttpClient, private authService: AuthService){
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      // ville: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordsMatch });

  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  get f() { return this.registerForm.controls; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    localStorage.removeItem('access_token'); // ou sessionStorage.clear() si c’est là
   }

  register() {
    this.submitted=true
    if (this.registerForm.valid) {
      this.http.post('http://127.0.0.1:8000/api/utilisateurs/', this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Inscription réussie. Vous pouvez maintenant vous connecter.';
          this.registerForm.reset();
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l’inscription.';
          console.error(err);
        }
      });
    }

  }




  navigateToLogin(){
    this.router.navigate(['/auth/login'])
  }
}
