import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterclientComponent } from "../../../client/pages/footerclient/footerclient.component";
import { FooterpublicComponent } from "../footerpublic/footerpublic.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterpublicComponent, FooterpublicComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {
  constructor(private router:Router){}
  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
  navigateToRegister(){
    this.router.navigate(['/auth/register'])
  }
}
