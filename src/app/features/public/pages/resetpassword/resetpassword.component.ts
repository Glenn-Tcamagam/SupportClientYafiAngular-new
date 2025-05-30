import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {


  constructor(private fb: FormBuilder,private router:Router){

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

navigateToLogin(){
    this.router.navigate(['/auth/login'])
  }
}
