import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../profiladmin/admin.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'pdfmake/build/vfs_fonts';

declare var bootstrap: any;

@Component({
  selector: 'app-agentadmin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './agentadmin.component.html',
  styleUrls: ['./agentadmin.component.css']  // corrigé ici
})
export class AgentadminComponent {

  // Liste des mois pour select
  months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  // Années (exemple, génère dynamique ci-dessous)
  years: number[] = [];

  registerForm: FormGroup;
  submitted = false;
  showPassword = false;

  agents: any[] = [];
  selectedAgent: any = null;
  searchTerm: string = '';
  agentStats: any = null;

  // Valeurs sélectionnées par défaut
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  newAgent: {
    nom: string;
    email: string;
    telephone: string;
    password?: string;
  } = {
    nom: '',
    email: '',
    telephone: ''
  };

  showSidebarMobile = false;
  isDesktop = window.innerWidth >= 768;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {

    // Met à jour isDesktop au chargement
  window.addEventListener('resize', () => {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.showSidebarMobile = false;
    }
  });

    this.fetchAgents();
    this.generateYears();
  }

  get f() { return this.registerForm.controls; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  fetchAgents(): void {
    this.adminService.getAgents().subscribe({
      next: (data) => this.agents = data || [],
      error: (err) => console.error('Erreur chargement des agents', err)
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm) return this.fetchAgents();
    this.adminService.getAgents().subscribe({
      next: (data) => {
        this.agents = data.filter(agent =>
          agent.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          agent.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      },
      error: (err) => console.error('Erreur recherche agents', err)
    });
  }

  createAgent(): void {
    const payload = {
      nom: this.newAgent.nom,
      email: this.newAgent.email,
      telephone: this.newAgent.telephone,
      password: this.newAgent.password,
      role: 'agent'
    };

    this.adminService.createAgent(payload).subscribe({
      next: () => {
        this.fetchAgents();
        this.newAgent = { nom: '', email: '', telephone: '', password: '' };
        this.closeModal('modiferagentModal');
      },
      error: (err) => console.error('❌ Erreur création agent', err.error)
    });
  }

  openModal(agent: any): void {
    this.selectedAgent = { ...agent };
    this.newAgent = {
      nom: agent.nom || '',
      email: agent.email || '',
      telephone: agent.telephone || '',
      password: ''
    };

    // Charger les statistiques dès l'ouverture du modal
    this.loadAgentStats(agent.id, this.selectedMonth, this.selectedYear);
  }

  updateAgent(): void {
    if (!this.selectedAgent?.id) return;

    const dataToSend: Partial<typeof this.newAgent> = { ...this.newAgent };
    if (!dataToSend.password) delete dataToSend.password;

    this.adminService.updateAgent(this.selectedAgent.id, dataToSend).subscribe({
      next: () => {
        alert("Agent mis à jour !");
        this.fetchAgents();
        this.newAgent = { nom: '', email: '', telephone: '', password: '' };
        this.closeModal('modiferagentModal');
      },
      error: (err) => console.error('Erreur mise à jour agent', err)
    });
  }

  deleteAgent(agentId: number): void {
    if (!confirm("Es-tu sûr de vouloir supprimer cet agent ?")) return;
    this.adminService.deleteAgent(agentId).subscribe({
      next: () => {
        alert("Agent supprimé avec succès !");
        this.fetchAgents();
      },
      error: (err) => {
        console.error("Erreur suppression agent", err);
        alert("Échec de la suppression.");
      }
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    console.log("Formulaire validé ✅", this.registerForm.value);
  }

  toggleSidebar() {
    this.showSidebarMobile = !this.showSidebarMobile;
  }

  openStatsModal(agent: any): void {
    this.selectedAgent = agent;
    this.loadAgentStats(agent.id, this.selectedMonth, this.selectedYear);
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('statsModal'));
      modal.show();
    });
  }

  closeModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
      modalEl.classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }
  }

  /** ✅ Charger les statistiques d’un agent pour un mois et une année donnés */
  loadAgentStats(agentId: number, mois: number, annee: number): void {
    this.adminService.getAgentStats(agentId, mois, annee).subscribe({
      next: (data) => {
        this.agentStats = {
          totalTickets: data.total_tickets ?? 0,
          openTickets: data.en_cours ?? 0,
          resolvedTickets: data.resolus ?? 0,
          rejectedTickets: data.rejetes ?? 0,
          resolutionRate: data.resolution_rate ?? 0,
          resolutionTime: data.average_resolution_time ?? 0
        };
        console.log("📊 Statistiques agent :", this.agentStats);
      },
      error: (err) => {
        console.error("Erreur chargement stats agent", err);
        this.agentStats = null;
      }
    });
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for(let i = 0; i <= 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  /** 🔁 Réagit au changement de filtre (mois ou année) */
  onFilterChange(): void {
    if (this.selectedAgent?.id) {
      this.loadAgentStats(this.selectedAgent.id, this.selectedMonth, this.selectedYear);
    }
  }

  /** Méthode appelée pour générer et télécharger le rapport Excel complet */
  generateExcelReport(): void {
    if (!this.agents.length) {
      alert("Aucun agent à afficher.");
      return;
    }

    // Calcul du mois précédent en gérant janvier
    let prevMonth = this.selectedMonth - 1;
    let prevYear = this.selectedYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    // Promesses pour stats mois actuel et mois précédent
    const statsPromises = this.agents.map(agent => {
      return Promise.all([
        this.adminService.getAgentStats(agent.id, this.selectedMonth, this.selectedYear).toPromise(),
        this.adminService.getAgentStats(agent.id, prevMonth, prevYear).toPromise()
      ]).then(([currentStats, previousStats]) => ({ agent, currentStats, previousStats }));
    });

    Promise.all(statsPromises).then(results => {
      const ws_data: any[][] = [];

      // Entête tableau
      ws_data.push([
        'Nom agent', 'Email',
        'Total tickets', 'En cours', 'Résolus', 'Rejetés',
        'Taux résolution (%)', 'Temps moyen réponse (jours)',
        'Total tickets (mois précédent)', 'En cours (mois précédent)', 'Résolus (mois précédent)', 'Rejetés (mois précédent)',
        'Taux résolution (%) (mois précédent)', 'Temps moyen réponse (jours) (mois précédent)',
        'Commentaire'
      ]);

      // Remplir le tableau avec chaque agent
      results.forEach(({agent, currentStats, previousStats}) => {
        // Sécuriser les stats
        const c = currentStats || {};
        const p = previousStats || {};

        // Calculs
        const tauxResolutionCurrent = c.resolution_rate != null ? (c.resolution_rate).toFixed(2) : 'N/A';
        const tauxResolutionPrev = p.resolution_rate != null ? (p.resolution_rate ).toFixed(2) : 'N/A';

        // Commentaire automatique simple
        let commentaire = "Stable";
        if (c.resolution_rate > (p.resolution_rate || 0)) commentaire = "Amélioration";
        else if (c.resolution_rate < (p.resolution_rate || 0)) commentaire = "Régression";

        ws_data.push([
          agent.nom || 'N/A',
          agent.email || 'N/A',
          c.total_tickets ?? 0,
          c.en_cours ?? 0,
          c.resolus ?? 0,
          c.rejetes ?? 0,
          tauxResolutionCurrent,
          c.average_resolution_time ? c.average_resolution_time.toFixed(2) : 'N/A',
          p.total_tickets ?? 0,
          p.en_cours ?? 0,
          p.resolus ?? 0,
          p.rejetes ?? 0,
          tauxResolutionPrev,
          p.average_resolution_time ? p.average_resolution_time.toFixed(2) : 'N/A',
          commentaire
        ]);
      });

      // Créer un classeur Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, 'Rapport Agents');

      // Générer fichier Excel et lancer téléchargement
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, `rapport_agents_${this.selectedMonth}_${this.selectedYear}.xlsx`);

    }).catch(error => {
      console.error("Erreur génération rapport Excel", error);
      alert("Erreur lors de la génération du rapport Excel.");
    });
  }

}
