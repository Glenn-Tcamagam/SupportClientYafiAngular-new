import { Component, OnInit } from '@angular/core';
import { NavbarclientComponent } from '../navbarclient/navbarclient.component';
import { ChatbotLayoutComponent } from '../chatbot-layout/chatbot-layout.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../profil/user.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [NavbarclientComponent, ChatbotLayoutComponent, CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];

  selectedTicket: any = null;
  searchTerm: string = '';
  selectedStatus: string = '';
  statuses: string[] = [];
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.selectedTicket = null;
    this.fetchClientTickets();
  }

  fetchClientTickets(): void {
    this.userService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.filteredTickets = [...this.tickets];
        this.statuses = [...new Set(data.map((t: any) => t.statut))];
      },
      error: (err) => console.error('Erreur chargement tickets client', err)
    });
  }

  openDetailsModal(ticket: any): void {
    this.selectedTicket = ticket;
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
