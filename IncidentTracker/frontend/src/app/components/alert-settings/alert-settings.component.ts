import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AlertService, AlertConfig } from '../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileMessageDialogComponent } from '../../shared/profile-message-dialog/profile-message-dialog.component';

@Component({
  selector: 'app-alert-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './alert-settings.component.html',
  styleUrls: ['./alert-settings.component.css']
})
export class AlertSettingsComponent implements OnInit {

  model: AlertConfig = {
    radiusMeters: 0,
    timeWindowMinutes: 0,
    minIncidents: 0,
    lookbackDays: 0
  };

  loading = true;

  constructor(
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.alertService.getConfig().subscribe(cfg => {
      this.model = cfg;
      this.loading = false;
    });
  }

  save() {
    this.alertService.updateConfig(this.model).subscribe(() => {
      this.dialog.open(ProfileMessageDialogComponent, {
        width: '400px',
        data: {
          icon: 'check_circle',
          title: 'Success',
          message: 'Alert settings have been successfully updated.'
        }
      });
    });
  }
}