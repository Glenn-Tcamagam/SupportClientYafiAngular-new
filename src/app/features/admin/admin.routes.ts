import { Routes } from '@angular/router';
import { TicketComponent } from './pages/ticket/ticket.component';
import { ProfiladminComponent } from './pages/profiladmin/profiladmin.component';
import { PasswordadminComponent } from './pages/passwordadmin/passwordadmin.component';
import { DashboardadminComponent } from './pages/dashboardadmin/dashboardadmin.component';
import { AgentadminComponent } from './pages/agentadmin/agentadmin.component';



export const ADMIN_ROUTES: Routes = [
{path:'ticket', component:TicketComponent},
{path:'profil', component:ProfiladminComponent},
{path:'password', component:PasswordadminComponent},
{path:'dashboard', component: DashboardadminComponent},
{path:'agent', component: AgentadminComponent}

];