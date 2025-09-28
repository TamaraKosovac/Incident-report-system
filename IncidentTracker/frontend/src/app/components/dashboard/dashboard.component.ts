import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService ) {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']); 
  }
}