import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmLogoutDialogComponent } from '../../shared/confirm-logout-dialog/confirm-logout-dialog.component';
import { Role } from '../../models/enums/role.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {
  pageTitle = 'Dashboard';
  private destroy$ = new Subject<void>();
  isLoggedIn = false;
  Role = Role;
  userRole: Role | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          return child?.snapshot.data?.['title'] ?? 'Dashboard';
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(title => (this.pageTitle = title));
      
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getRole() as Role;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout() {
    const dialogRef = this.dialog.open(ConfirmLogoutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.isLoggedIn = false;
        this.userRole = null; 
        this.router.navigate(['/']);
      }
    });
  }

  getRolePrefix(): string {
    if (!this.isLoggedIn) return 'Guest dashboard';

    switch (this.userRole) {
      case Role.ADMIN:
        return 'Admin dashboard';
      case Role.MODERATOR:
        return 'Moderator dashboard';
      case Role.USER:
        return 'User dashboard';
      default:
        return 'Dashboard';
    }
  }
}