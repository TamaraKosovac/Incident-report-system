import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportComponent } from './components/incidents/report/report.component';
import { MapComponent } from './components/incidents/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MyIncidentsComponent } from './components/incidents/my-incidents/my-incidents.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ModeratorMapComponent } from './components/incidents/moderator-map/moderator-map.component';
import { UsersComponent } from './components/users/users.component';
import { Role } from './models/enums/role.enum';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'report', component: ReportComponent, data: { title: 'Report incident' } },
      { path: 'map', component: MapComponent, data: { title: 'Incident map' } },
      { path: 'my-incidents', component: MyIncidentsComponent, canActivate: [RoleGuard],  data: { title: 'My incidents', roles: [Role.USER] } },
      { path: 'edit-profile', component: EditProfileComponent, canActivate: [RoleGuard],  data: { title: 'Edit profile', roles: [Role.USER] } },
      { path: 'moderator-map', component: ModeratorMapComponent, canActivate: [RoleGuard], data: { title: 'Approve incidents', roles: [Role.MODERATOR] } },
      { path: 'users', component: UsersComponent, canActivate: [RoleGuard], data: { title: 'Edit employees', roles: [Role.ADMIN] } },
      { path: '', component: DashboardComponent, canActivate: [RoleGuard], data: { redirectRoot: true } }
    ]
  },

  { path: '**', redirectTo: '' } 
];