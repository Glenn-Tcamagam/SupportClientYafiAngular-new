import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentService } from '../profilagent/agent.service';

@Component({
  selector: 'app-passwordagent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passwordagent.component.html',
  styleUrl: './passwordagent.component.css'
})
export class PasswordagentComponent {
  oldPassword = '';
  newPassword = '';
  passwordMessage = '';

  onChangePassword(): void {
    this.agentService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: (res) => {
        this.passwordMessage = res.message;
      },
      error: (err) => {
        this.passwordMessage = err.error?.error || "Une erreur s'est produite.";
      }
    })
  }

  constructor(private router:Router, private fb: FormBuilder, private agentService: AgentService){


    this.registerForm = this.fb.group({

      password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
        ]],
        confirmPassword: ['']
      }, { validators: this.passwordsMatch });

  }




// ----------------------------------------debut formulaire
registerForm: FormGroup ;
  submitted = false;
  showPassword = false;

passwordsMatch(group: FormGroup) {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { notMatching: true };
}

get f() { return this.registerForm.controls; }

togglePassword() {
  this.showPassword = !this.showPassword;
}

onSubmit() {
  this.submitted = true;
  if (this.registerForm.invalid) return;
  console.log("Formulaire validé ✅", this.registerForm.value);
}

// ----------------------------------------fin formulaire

//  DEBUT   LES NAVBAR
showSidebarMobile = false;
isDesktop = window.innerWidth >= 768;

ngOnInit() {
  // Met à jour isDesktop au chargement
  window.addEventListener('resize', () => {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.showSidebarMobile = false;
    }
  });
}

toggleSidebar() {
  this.showSidebarMobile = !this.showSidebarMobile;
}

// FIN DES DEUX NAVBAR

logout(): void {
  // Supprimer le token JWT du stockage local
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  // Tu peux aussi réinitialiser d'autres données utilisateur stockées
  localStorage.removeItem('user');

  // Rediriger vers la page de login
  this.router.navigate(['/auth/login']);
}









}
function onChangePassword() {
  throw new Error('Function not implemented.');
}

