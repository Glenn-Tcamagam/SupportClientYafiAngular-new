import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../profiladmin/admin.service';

import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboardadmin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.css']
})
export class DashboardadminComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartRef!: ElementRef;
  @ViewChild('timeChartCanvas') timeChartRef!: ElementRef;
  chart: any;
  timeChart: any;

  profile: any;
  stats: any;
  selectedYear = new Date().getFullYear();
  years: number[] = [];

  //  DEBUT   LES NAVBAR
showSidebarMobile = false;
isDesktop = window.innerWidth >= 768;

  constructor(private router: Router, private adminservice: AdminService) {}

  ngOnInit(): void {

 // Met à jour isDesktop au chargement
  window.addEventListener('resize', () => {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.showSidebarMobile = false;
    }
  });

    this.adminservice.getProfile().subscribe({
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
    // Les graphiques seront chargés après récupération des stats
  }

  populateYearFilter() {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.years.push(y);
    }
    this.selectedYear = currentYear;
  }

  loadStats() {
    this.adminservice.getGlobalStats(this.selectedYear).subscribe(data => {
      this.stats = data;
      console.log("Stats globales admin :", this.stats);

      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];

      const labels = data.monthly_resolution_rate.map((item: any) => monthNames[item.month - 1]);
      const resolutionRates = data.monthly_resolution_rate.map((item: any) => item.resolution_rate);
      const resolutionTimes = data.monthly_resolution_time.map((item: any) => item.average_resolution_time);

      this.renderChart(labels, resolutionRates);
      this.renderTimeChart(labels, resolutionTimes);
    });
  }

  renderChart(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Taux de résolution (%)',
          data: data,
          fill: true,
          borderColor: 'rgba(237, 203, 12, 0.91)',
          backgroundColor: 'rgba(215, 191, 53, 0.33)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (tickValue) => typeof tickValue === 'number' ? `${tickValue}%` : tickValue
            }
          }
        }
      }
    });
  }

  renderTimeChart(labels: string[], data: number[]) {
    if (this.timeChart) {
      this.timeChart.destroy();
    }

    this.timeChart = new Chart(this.timeChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temps moyen de résolution (heures)',
          data: data,
          backgroundColor: 'rgba(53, 132, 215, 0.6)',
          borderColor: 'rgba(53, 132, 215, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Heures'
            }
          }
        }
      }
    });
  }

  onYearChange(newYear: number) {
    this.selectedYear = newYear;
    this.loadStats();
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
