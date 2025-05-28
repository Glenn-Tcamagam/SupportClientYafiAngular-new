import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/pages/home/home.component';
import { RoleGuard } from './auth/role.guard';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';


export class AppModule {}

export const routes: Routes = [
 {
        path: '',
        loadChildren: () => import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES)
      },
  {
     path: 'auth',
    loadChildren: () => import('./auth/login.routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: 'auth',
   loadChildren: () => import('./auth/register.routes').then(m => m.REGISTER_ROUTES)
 },
  {
    path: 'client',
    loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),
    canActivate: [RoleGuard],
  data: { expectedRole: 'client' }
  },
  {
    path: 'agent',
    loadChildren: () => import('./features/agent/agent.routes').then(m => m.AGENT_ROUTES),
    canActivate: [RoleGuard],
  data: { expectedRole: 'agent' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [RoleGuard],
  data: { expectedRole: 'admin' }
  },
];
//   {path:"", component: HomeComponent},  // Redirection par défaut
//   { path: '**', redirectTo: 'home', component: HomeComponent }  // Gère les routes inconnues

