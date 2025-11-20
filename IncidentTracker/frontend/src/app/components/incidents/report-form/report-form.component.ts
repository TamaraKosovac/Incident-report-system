import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { IncidentType } from '../../../models/enums/incident-type.enum';
import { IncidentSubtype } from '../../../models/enums/incident-subtype.enum';
import { IncidentService } from '../../../services/incident.service';

interface IncidentForm {
  type: IncidentType | '';
  subtype: IncidentSubtype | '';
  description: string;
  image: File | null;
  location: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
}

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
    MatSelectModule,
    MatSnackBarModule 
  ],
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  incident: IncidentForm = {
    type: '',
    subtype: '',
    description: '',
    image: null,
    location: {
      address: '',
      latitude: null,
      longitude: null
    }
  };

  selectedImage: File | null = null;
  selectedImagePreview: string | null = null;
  incidentTypes = Object.values(IncidentType);

  subtypesByType: Record<IncidentType, IncidentSubtype[]> = {
    [IncidentType.FIRE]: [
      IncidentSubtype.BUILDING_FIRE,
      IncidentSubtype.FOREST_FIRE,
      IncidentSubtype.VEHICLE_FIRE,
      IncidentSubtype.ELECTRICAL_FIRE,
      IncidentSubtype.WASTE_FIRE
    ],
    [IncidentType.FLOOD]: [
      IncidentSubtype.RIVER_FLOOD,
      IncidentSubtype.URBAN_FLOOD,
      IncidentSubtype.SEWER_OVERFLOW,
      IncidentSubtype.BASEMENT_FLOOD
    ],
    [IncidentType.ACCIDENT]: [
      IncidentSubtype.CAR_ACCIDENT,
      IncidentSubtype.BIKE_ACCIDENT,
      IncidentSubtype.PEDESTRIAN_ACCIDENT,
      IncidentSubtype.WORK_ACCIDENT,
      IncidentSubtype.SPORT_ACCIDENT
    ],
    [IncidentType.CRIME]: [
      IncidentSubtype.ROBBERY,
      IncidentSubtype.ASSAULT,
      IncidentSubtype.VANDALISM,
      IncidentSubtype.BURGLARY,
      IncidentSubtype.DRUG_ABUSE,
      IncidentSubtype.ILLEGAL_DUMPING
    ],
    [IncidentType.INFRASTRUCTURE]: [
      IncidentSubtype.POWER_OUTAGE,
      IncidentSubtype.WATER_OUTAGE,
      IncidentSubtype.GAS_LEAK,
      IncidentSubtype.ROAD_DAMAGE,
      IncidentSubtype.BROKEN_TRAFFIC_LIGHT,
      IncidentSubtype.BRIDGE_DAMAGE
    ],
    [IncidentType.HEALTH]: [
      IncidentSubtype.MEDICAL_EMERGENCY,
      IncidentSubtype.EPIDEMIC,
      IncidentSubtype.ANIMAL_ATTACK,
      IncidentSubtype.MISSING_PERSON
    ],
    [IncidentType.ENVIRONMENT]: [
      IncidentSubtype.AIR_POLLUTION,
      IncidentSubtype.WATER_POLLUTION,
      IncidentSubtype.NOISE_POLLUTION,
      IncidentSubtype.ILLEGAL_LOGGING,
      IncidentSubtype.ANIMAL_CRUELTY
    ]
  };

  constructor(
    private dialogRef: MatDialogRef<ReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { latitude: number; longitude: number },
    private incidentService: IncidentService,
    private snackBar: MatSnackBar 
  ) {
    this.incident.location.latitude = data.latitude ? Number(data.latitude.toFixed(5)) : null;
    this.incident.location.longitude = data.longitude ? Number(data.longitude.toFixed(5)) : null;

  }

  ngOnInit(): void {
    if (!this.incident.location.latitude || !this.incident.location.longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            this.incident.location.latitude = Number(pos.coords.latitude.toFixed(5));
            this.incident.location.longitude = Number(pos.coords.longitude.toFixed(5));
          },
          () => {
            console.warn('Geolocation not allowed or failed.');
          }
        );
      }
    }
  }

  get availableSubtypes(): IncidentSubtype[] {
    return this.incident.type
      ? this.subtypesByType[this.incident.type as IncidentType]
      : [];
  }

  onTypeChange() {
    const type = this.incident.type as IncidentType;
    const availableSubtypes = this.subtypesByType[type] || [];
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
    this.incidentService.createIncident(this.incident).subscribe({
      next: (res) => {
        this.snackBar.open('Incident reported successfully!', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(res);
      },
      error: () => {
        this.snackBar.open('Failed to report incident.', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}