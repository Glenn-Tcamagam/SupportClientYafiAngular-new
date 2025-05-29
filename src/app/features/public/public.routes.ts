import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EnvoiemailComponent } from './pages/envoiemail/envoiemail.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';





export const PUBLIC_ROUTES: Routes = [
    {path:"", component:HomeComponent},
    {path:"home", component:HomeComponent},
    {path: "envoimail", component:EnvoiemailComponent},
    {path: "resetpassword", component: ResetpasswordComponent}

];
