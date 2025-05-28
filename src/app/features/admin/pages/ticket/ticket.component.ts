import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../profiladmin/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  tickets: any[] = [];
  filteredTickets: any[] = [];

  selectedTicket: any = null;
  searchTerm: string = '';
  selectedStatus: string = '';
  statuses: string[] = [];
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private router: Router, private adminService: AdminService) {}

  // NAVBAR
  showSidebarMobile = false;
  isDesktop = window.innerWidth >= 768;

  ngOnInit(): void {

 // Met à jour isDesktop au chargement
  window.addEventListener('resize', () => {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.showSidebarMobile = false;
    }
  });

    this.selectedTicket = null;
    this.fetchTickets();
  }

  fetchTickets(): void {
    this.adminService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.filteredTickets = [...this.tickets];
        this.statuses = [...new Set(data.map((t: any) => t.statut))]; // Statuts uniques
      },
      error: (err) => console.error('Erreur chargement tickets', err)
    });
  }

  openDetailsModal(ticket: any): void {
    this.selectedTicket = ticket;
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

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesSearch = this.searchTerm === '' || Object.values(ticket).some(value =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      const matchesStatus = this.selectedStatus === '' || ticket.statut === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    this.sortByDate();
  }

  sortByDate(): void {
    this.filteredTickets.sort((a, b) => {
      const dateA = new Date(a.date_creation).getTime();
      const dateB = new Date(b.date_creation).getTime();
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortByDate();
  }
}
