import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../profilagent/agent.service';

declare var bootstrap: any;

// Interface complète
interface Ticket {
  id: number;
  titre: string;
  description: string;
  statut: string;
  date_creation: string;
  date_modification: string;
}

@Component({
  selector: 'app-ticketassigneagent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticketassigneagent.component.html',
  styleUrl: './ticketassigneagent.component.css'
})
export class TicketassigneagentComponent implements OnInit, AfterViewInit {
  showSidebarMobile = false;
  isDesktop = window.innerWidth >= 768;

  readonly allStatuses: string[] = ['Assigné', 'En cours', 'Résolu', 'Rejeté'];

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  searchTerm = '';
  selectedStatus = '';
  statuses: string[] = [];
  sortDirection: 'asc' | 'desc' = 'desc';

  ticketModal: any;
  selectedTicket: Ticket | null = null;

  constructor(
    private router: Router,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth >= 768;
      if (this.isDesktop) this.showSidebarMobile = false;
    });

    this.fetchTicketsForAgent();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('ticketDetailModal');
    if (modalElement) {
      this.ticketModal = new bootstrap.Modal(modalElement);
    }
  }

  onChangeStatut(ticketId: number, event: Event): void {
  const selectElement = event.target as HTMLSelectElement | null;
  if (selectElement) {
    const nouveauStatut = selectElement.value;
    this.changerStatut(ticketId, nouveauStatut);
  }
}

  toggleSidebar(): void {
    this.showSidebarMobile = !this.showSidebarMobile;
  }

  getAutresStatuts(statutActuel: string): string[] {
  return this.allStatuses.filter(status => status !== statutActuel);
}


  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  fetchTicketsForAgent(): void {
    this.agentService.getMesTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
        this.filteredTickets = [...data];
        this.statuses = [...new Set(data.map(ticket => ticket.statut))];
        this.applyFilters();
      },
      error: (err) => console.error('Erreur lors du chargement des tickets:', err)
    });
  }

  openDetailsModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    if (this.ticketModal) {
      this.ticketModal.show();
    }
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const search = this.searchTerm.toLowerCase();
      const matchesSearch = !this.searchTerm || Object.values(ticket).some(value =>
        value?.toString().toLowerCase().includes(search)
      );
      const matchesStatus = !this.selectedStatus || ticket.statut === this.selectedStatus;

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

  changerStatut(ticketId: number, nouveauStatut: string): void {
    if (!nouveauStatut) return;

    this.agentService.changerStatutTicket(ticketId, nouveauStatut).subscribe({
      next: () => {
        console.log(`Statut du ticket ${ticketId} mis à jour.`);
        this.fetchTicketsForAgent();
      },
      error: (err) => console.error('Erreur changement statut:', err)
    });
  }
}
