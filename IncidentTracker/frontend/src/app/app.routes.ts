import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportComponent } from './components/incidents/report/report.component';
import { MapComponent } from './components/incidents/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MyIncidentsComponent } from './components/incidents/my-incidents/my-incidents.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'report', component: ReportComponent, data: { title: 'Report incident' } },
      { path: 'map', component: MapComponent, data: { title: 'Incident map' } },
      { path: 'my-incidents', component: MyIncidentsComponent, data: { title: 'My incidents' } },
      { path: '', redirectTo: 'report', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' } 
];