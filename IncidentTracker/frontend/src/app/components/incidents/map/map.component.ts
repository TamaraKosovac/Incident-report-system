import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { IncidentsService } from '../../../services/incidents.service';
import { Incident } from '../../../models/incident.model';

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
  private markers: L.Marker[] = [];

  incidentTypes: string[] = ['Traffic Accident', 'Fire', 'Flood', 'Other'];
  selectedType: string = '';
  selectedSubtype: string = '';
  locationFilter: string = '';
  selectedPeriod: string = 'all';

  private orangeIcon: L.DivIcon = L.divIcon({
    html: `<span class="material-icons" 
                 style="color: #e67e22; font-size: 30px;">location_on</span>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  constructor(private incidentsService: IncidentsService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.applyFilters();
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
    this.incidentsService.getApprovedIncidentsFiltered(
      this.selectedType || undefined,
      this.selectedSubtype || undefined,
      this.locationFilter || undefined,
      this.selectedPeriod
    ).subscribe((incidents: Incident[]) => {
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];

      incidents.forEach(incident => {
        if (incident.location) {
          const marker = L.marker(
            [incident.location.latitude, incident.location.longitude],
            { icon: this.orangeIcon }   
          ).addTo(this.map);

          marker.bindPopup(`
            <div style="font-family: Roboto, sans-serif; font-size: 13px; line-height: 1.4; max-width: 250px;">
              ${incident.imagePath 
                ? `<div style="text-align:center; margin-bottom:8px;">
                    <img src="http://localhost:8080${incident.imagePath}" width="180" style="border-radius:6px;" />
                  </div>` 
                : ''
              }

              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <div>
                  <span class="material-icons" style="font-size:16px; vertical-align:middle; color:#555;">category</span>
                  ${incident.type} - ${incident.subtype ?? '-'}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <div>
                  <span class="material-icons" style="font-size:16px; vertical-align:middle; color:#555;">calendar_month</span>
                  ${incident.createdAt ? new Date(incident.createdAt).toLocaleDateString() : '-'}
                </div>
                <div>
                  <span class="material-icons" style="font-size:16px; vertical-align:middle; color:#555;">description</span>
                  ${incident.description ?? '-'}
                </div>
              </div>
            </div>
          `);

          this.markers.push(marker);
        }
      });
    });
  }
}
