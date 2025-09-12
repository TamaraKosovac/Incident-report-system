import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ]
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;

  incidentTypes: string[] = ['Traffic Accident', 'Fire', 'Flood', 'Other'];
  selectedType: string = '';
  selectedSubtype: string = '';
  locationFilter: string = '';
  selectedPeriod: string = 'all';

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('incidentMap', {
      center: [44.78, 17.19],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  applyFilters(): void {
    console.log('Smart filter triggered:', {
      type: this.selectedType,
      location: this.locationFilter,
      period: this.selectedPeriod
    });
  }
}
