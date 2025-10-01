import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/enums/role.enum';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: Role[] = route.data['roles'];
    const userRole = this.auth.getRole();

    if (!this.auth.isLoggedIn() || !expectedRoles.includes(userRole as Role)) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}