import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../../services/incident.service';
import { Incident } from '../../../models/incident.model';

@Component({
  selector: 'app-my-incidents-map',
  standalone: true,
  templateUrl: './my-incidents.component.html',
  styleUrls: ['./my-incidents.component.css'],
  imports: [CommonModule]
})
export class MyIncidentsComponent implements AfterViewInit {

  private map!: L.Map;
  private markers: L.Marker[] = [];

  private orangeIcon: L.DivIcon = L.divIcon({
    html: `<span class="material-icons" 
                 style="color: #e67e22; font-size: 30px;">location_on</span>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  constructor(private incidentService: IncidentService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadMyIncidents();
  }

  private initMap(): void {
    this.map = L.map('myIncidentsMap', {
      center: [44.78, 17.19],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private loadMyIncidents(): void {
    this.incidentService.getMyIncidents().subscribe((incidents: Incident[]) => {
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];

      incidents.forEach(incident => {
        if (incident.location) {
          const marker = L.marker(
            [incident.location.latitude, incident.location.longitude],
            { icon: this.orangeIcon }
          ).addTo(this.map);

          marker.bindPopup(`
            <div style="text-align:center; margin-bottom:8px;">
              <span style="
                display:inline-block;
                padding:4px 10px;
                border-radius:12px;
                font-weight:bold;
                color:#fff;
                background-color:${
                  incident.status === 'APPROVED' ? 'green' : 
                  incident.status === 'REJECTED' ? 'red' : '#e67e22'
                }">
                ${incident.status}
              </span>
            </div>

            <div style="font-family: Roboto, sans-serif; font-size: 13px; line-height: 1.4; max-width: 250px;">
              ${incident.imagePath 
                ? `<div style="text-align:center; margin-bottom:8px;">
                    <img src="http://localhost:8080${incident.imagePath}" width="180" style="border-radius:6px;" />
                  </div>` 
                : ''
              }

              <div style="margin-bottom: 6px;">
                <span class="material-icons" style="font-size:16px; vertical-align:middle; color:#555;">category</span>
                ${incident.type} - ${incident.subtype ?? '-'}
              </div>

              <div style="margin-bottom: 6px;">
                <span class="material-icons" style="font-size:16px; vertical-align:middle; color:#555;">calendar_month</span>
                ${incident.createdAt 
                  ? new Date(incident.createdAt).toLocaleDateString('sr-Latn-BA', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    }) 
                  : '-'}
              </div>

              <div style="margin-bottom: 6px;">
                <span class="material-icons" style="font-size:16px; vertical-align:middle; color:#555;">description</span>
                ${incident.description ?? '-'}
              </div>
              
              <div>
                <span class="material-icons" style="font-size:16px; vertical-align:middle; color:#555;">translate</span>
                ${incident.descriptionEn ?? '-'}
              </div>
            </div>
          `);
          this.markers.push(marker);
        }
      });
    });
  }
}