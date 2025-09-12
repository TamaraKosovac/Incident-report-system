import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  incident: any = {
    type: '',
    subtype: '',
    description: '',
    image: null,
    latitude: null,
    longitude: null
  };

  constructor(
    private dialogRef: MatDialogRef<ReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { latitude: number; longitude: number }
  ) {
    // inicijalizacija lokacije odmah
    this.incident.latitude = data.latitude;
    this.incident.longitude = data.longitude;
  }

  onFileSelected(event: any) {
    this.incident.image = event.target.files[0];
  }

  save() {
    console.log('Incident reported:', this.incident);
    this.dialogRef.close(this.incident);
  }

  cancel() {
    this.dialogRef.close();
  }
}
