import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent implements OnInit {

  moderatorId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public alerts: any[],
    private alertService: AlertService,
    private dialogRef: MatDialogRef<AlertPopupComponent>
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      this.moderatorId = decoded.userId;
    }

    this.markAllAsRead();
  }

  markAllAsRead() {
    if (!this.alerts || this.alerts.length === 0) return;

    this.alerts.forEach(a => {
      this.alertService.markAsRead(this.moderatorId, a.id).subscribe();
    });
  }
}
