import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarclientComponent } from '../navbarclient/navbarclient.component';
import { FooterclientComponent } from "../footerclient/footerclient.component";
import { UserService } from '../profil/user.service';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [NavbarclientComponent, FooterclientComponent],
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent {
  profile: any;

  constructor(private router: Router, private userService: UserService ){}

  navigateToLogin(){
    this.router.navigate(['/auth/login'])
  }
  navigateToCahtbot(){
    this.router.navigate(['/client/chatbot'])
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

}
