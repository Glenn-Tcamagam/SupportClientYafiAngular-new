import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.testService.getTest().subscribe({
      next: res => console.log('Réponse du backend :', res),
      error: err => console.error('Erreur :', err)
    });
  }
}
