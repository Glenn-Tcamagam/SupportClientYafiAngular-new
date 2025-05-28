import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../profilagent/agent.service';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboardagent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboardagent.component.html',
  styleUrls: ['./dashboardagent.component.css']
})
export class DashboardagentComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartRef!: ElementRef;
  chart: any;

  profile: any;
  stats: any;
  selectedYear = new Date().getFullYear();
  years: number[] = [];

  showSidebarMobile = false;
  isDesktop = window.innerWidth >= 768;

  constructor(private router: Router, private agentservice: AgentService) {}

  ngOnInit(): void {

 // Met à jour isDesktop au chargement
  window.addEventListener('resize', () => {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.showSidebarMobile = false;
    }
  });

    this.agentservice.getProfile().subscribe({
      next: data => {
        this.profile = data;
        console.log("Profil de l'utilisateur connecté :", this.profile);
      },
      error: err => {
        console.error("Erreur lors de la récupération du profil", err);
      }
    });

    this.populateYearFilter();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Le graphe sera initialisé quand les stats seront chargées dans loadStats()
  }

  populateYearFilter() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.years.push(y);
    }
  }

  loadStats() {
    this.agentservice.getAgentDashboardStats(this.selectedYear).subscribe(data => {
      this.stats = data;

      const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const labels = data.monthly_resolution_rate.map((item: any) => monthNames[item.month - 1]);
      const valeurs = data.monthly_resolution_rate.map((item: any) => item.resolution_rate);

      this.renderChart(labels, valeurs);
    });
  }

  renderChart(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy(); // détruire le graphe précédent
    }

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Taux de résolution (%)',
            data: data,
            fill: true,
            borderColor: 'rgba(237, 203, 12, 0.91)',
            backgroundColor: 'rgba(215, 191, 53, 0.33)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
  callback: function(tickValue) {
    return typeof tickValue === 'number' ? `${tickValue}%` : tickValue;
  }
}

          }
        }
      }
    });
  }

  toggleSidebar() {
    this.showSidebarMobile = !this.showSidebarMobile;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}
