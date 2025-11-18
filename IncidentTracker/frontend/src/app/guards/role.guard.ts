import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/enums/role.enum';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: Role[] = route.data['roles'];
    const userRole = this.auth.getRole();

if (route.data['redirectRoot']) {
  if (!this.auth.isLoggedIn()) {
    this.router.navigate(['/report']);
    return false;
  }

  if (userRole === Role.MODERATOR) {
      this.router.navigate(['/moderator-map']);
    } else if (userRole === Role.USER) {
      this.router.navigate(['/report']);
    } else if (userRole === Role.ADMIN) {
      this.router.navigate(['/users']);
    } else {
      this.router.navigate(['/report']);
    }

    return false;
  }

    if (expectedRoles && expectedRoles.length > 0) {
      if (!this.auth.isLoggedIn() || !expectedRoles.includes(userRole as Role)) {
        this.router.navigate(['/report']); 
        return false;
      }
    }
    return true;
  }
}