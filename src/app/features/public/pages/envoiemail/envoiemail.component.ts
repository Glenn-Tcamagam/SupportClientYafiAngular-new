import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-envoiemail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './envoiemail.component.html',
  styleUrl: './envoiemail.component.css'
})
export class EnvoiemailComponent {
    emailForm: FormGroup;


 constructor(private fb: FormBuilder, private router:Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.emailForm.get('email');
  }

  onSubmit() {
    if (this.emailForm.valid) {
      console.log('Adresse email :', this.emailForm.value.email);
      // Ici vous ajouterez plus tard la logique d'envoi du code
    }
  }

  navigateToResetpassword(){
    this.router.navigate(["/resetpassword"])
  }

}
