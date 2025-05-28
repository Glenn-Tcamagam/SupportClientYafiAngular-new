import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AgentService } from './agent.service';

@Component({
  selector: 'app-profilagent',
  standalone: true,
  imports: [],
  templateUrl: './profilagent.component.html',
  styleUrl: './profilagent.component.css'
})
export class ProfilagentComponent {
  profile: any;

  constructor(private router: Router, private agentservice: AgentService, ){}


  //  DEBUT   LES NAVBAR
  showSidebarMobile = false;
  isDesktop = window.innerWidth >= 768;

  //ngOnInit() {
    // Met à jour isDesktop au chargement
    //window.addEventListener('resize', () => {
     // this.isDesktop = window.innerWidth >= 768;
      //if (this.isDesktop) {
      //  this.showSidebarMobile = false;
      //}
    //});
  //}

  ngOnInit(): void {
    this.agentservice.getProfile().subscribe({
      next: data => {
        this.profile = data;
        console.log("Profil de l'utilisateur connecté :", this.profile);
      },
      error: err => {
        console.error("Erreur lors de la récupération du profil", err);
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
