import { Component, OnInit } from '@angular/core';
import { NavbarclientComponent } from '../navbarclient/navbarclient.component';
import { FooterclientComponent } from '../footerclient/footerclient.component';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NavbarclientComponent, FooterclientComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  profile: any;
   passwordForm: FormGroup;
    showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) {
this.passwordForm = this.fb.group({
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });

  }

    onSubmit() {
    console.log('Formulaire envoyé', this.passwordForm.value);
    // Tu peux traiter ici les données du formulaire
  }


  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: data => {
        this.profile = data;
        console.log("Profil de l'utilisateur connecté :", this.profile);
      },
      error: err => {
        console.error("Erreur lors de la récupération du profil", err);
      }
    });
  }

  logout(): void {
    // Supprimer le token JWT du stockage local
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Tu peux aussi réinitialiser d'autres données utilisateur stockées
    localStorage.removeItem('user');

    // Rediriger vers la page de login
    this.router.navigate(['/auth/login']);
  }


  // DEBUT PHOTO DE PROFIL
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // FIN PHOTO DE PROFIL

}
