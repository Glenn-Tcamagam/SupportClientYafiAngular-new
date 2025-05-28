import { Routes } from '@angular/router';
import { DashboardagentComponent } from './pages/dashboardagent/dashboardagent.component';
import { PasswordagentComponent } from './pages/passwordagent/passwordagent.component';
import { ProfilagentComponent } from './pages/profilagent/profilagent.component';
import { TicketassigneagentComponent } from './pages/ticketassigneagent/ticketassigneagent.component';



export const AGENT_ROUTES: Routes = [
{path: 'dashboard', component:DashboardagentComponent},
{path: 'password', component:PasswordagentComponent},
{path: 'profil', component:ProfilagentComponent},
{path: 'ticket', component:TicketassigneagentComponent}

];