import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbarclient',
  standalone: true,
  imports: [],
  templateUrl: './navbarclient.component.html',
  styleUrl: './navbarclient.component.css'
})
export class NavbarclientComponent {

  constructor(private router:Router){}
  logout(): void {
    // Supprimer le token JWT du stockage local
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Tu peux aussi réinitialiser d'autres données utilisateur stockées
    localStorage.removeItem('user');

    // Rediriger vers la page de login
    this.router.navigate(['/auth/login']);
  }
  navigateToCahtbot(){
    this.router.navigate(['/client/chatbot'])
  }


}
