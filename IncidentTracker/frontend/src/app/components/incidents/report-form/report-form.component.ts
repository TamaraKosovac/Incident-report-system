import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { IncidentSubtype } from '../../../models/enums/incident-subtype.enum';

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

  selectedImage: File | null = null;
  selectedImagePreview: string | null = null;

  subtypesByType: Record<string, IncidentSubtype[]> = {
    ACCIDENT: [IncidentSubtype.CAR_ACCIDENT],
    FIRE: [IncidentSubtype.BUILDING_FIRE],
    CRIME: [IncidentSubtype.ROBBERY, IncidentSubtype.ASSAULT],
    FLOOD: []
  };

  subtypeLabels: Record<IncidentSubtype, string> = {
    [IncidentSubtype.CAR_ACCIDENT]: 'Car Accident',
    [IncidentSubtype.BUILDING_FIRE]: 'Building Fire',
    [IncidentSubtype.ROBBERY]: 'Robbery',
    [IncidentSubtype.ASSAULT]: 'Assault'
  };

  constructor(
    private dialogRef: MatDialogRef<ReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { latitude: number; longitude: number }
  ) {
    this.incident.latitude = data.latitude;
    this.incident.longitude = data.longitude;
  }

  onTypeChange() {
    const availableSubtypes = this.subtypesByType[this.incident.type] || [];
    this.incident.subtype =
      availableSubtypes.length === 1 ? availableSubtypes[0] : '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.incident.image = file;

      const reader = new FileReader();
      reader.onload = e =>
        (this.selectedImagePreview = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.remove('dragover');

    if (event.dataTransfer?.files?.length) {
      const file = event.dataTransfer.files[0];
      this.selectedImage = file;
      this.incident.image = file;

      const reader = new FileReader();
      reader.onload = e =>
        (this.selectedImagePreview = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  save() {
    console.log('Incident reported:', this.incident);
    this.dialogRef.close(this.incident);
  }

  cancel() {
    this.dialogRef.close();
  }
}
