import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { ReportFormComponent } from '../incidents/report-form/report-form.component';

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

  private dialog = inject(MatDialog);

  constructor(private router: Router, private route: ActivatedRoute) {
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
      .subscribe(title => this.pageTitle = title);
  }

  openReportForm() {
    this.dialog.open(ReportFormComponent, {
      width: '600px',
      data: {}
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
