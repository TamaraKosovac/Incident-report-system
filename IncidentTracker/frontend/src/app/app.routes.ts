import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportComponent } from './components/incidents/report/report.component';
import { MapComponent } from './components/incidents/map/map.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'report', component: ReportComponent, data: { title: 'Report incident' } },
      { path: 'map', component: MapComponent, data: { title: 'Incident map' } },
      { path: '', redirectTo: 'report', pathMatch: 'full' }  
    ]
  }
];
