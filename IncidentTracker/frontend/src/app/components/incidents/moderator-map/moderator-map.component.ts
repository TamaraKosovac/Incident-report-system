import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { CommonModule } from '@angular/common';
import { IncidentsService } from '../../../services/incidents.service';
import { Incident } from '../../../models/incident.model';
import { IncidentStatus } from '../../../models/enums/incident-status.enum';

@Component({
  selector: 'app-moderator-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderator-map.component.html',
  styleUrls: ['./moderator-map.component.css']
})
export class ModeratorMapComponent implements AfterViewInit {

  private map!: L.Map;
  private markers = L.markerClusterGroup();

  constructor(private incidentsService: IncidentsService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadIncidents();
  }

  private initMap(): void {
    this.map = L.map('moderatorMap', {
      center: [44.78, 17.19],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private loadIncidents(): void {
    this.incidentsService.getIncidents().subscribe((incidents: Incident[]) => {
      this.markers.clearLayers();

      incidents.forEach(incident => {
        if (incident.location?.latitude && incident.location?.longitude) {
          const marker = L.marker(
            [incident.location.latitude, incident.location.longitude],
            { icon: this.getIconByStatus(incident.status as IncidentStatus) }
          ).bindPopup(this.buildPopup(incident));

          this.markers.addLayer(marker);
        }
      });

      this.map.addLayer(this.markers);
    });
  }

  private buildPopup(incident: Incident): string {
    return `
      <div style="text-align:center; margin-bottom:8px;">
        <span style="
          display:inline-block;
          padding:4px 10px;
          border-radius:12px;
          font-weight:bold;
          color:#fff;
          background-color:${this.getStatusColor(incident.status as IncidentStatus)}">
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
      </div>
    `;
  }

  private getIconByStatus(status: IncidentStatus | undefined): L.DivIcon {
    const color = this.getStatusColor(status);
    return L.divIcon({
      html: `<span class="material-icons" style="color: ${color}; font-size: 30px;">location_on</span>`,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  }

  private getStatusColor(status: IncidentStatus | undefined): string {
    switch (status) {
      case IncidentStatus.APPROVED: return 'green';
      case IncidentStatus.REJECTED: return 'red';
      case IncidentStatus.DUPLICATE: return '#9c27b0'; 
      case IncidentStatus.RESOLVED: return 'blue';
      case IncidentStatus.CANCELED: return 'gray';
      case IncidentStatus.PENDING: return '#e67e22'; 
      case IncidentStatus.REPORTED: 
      default:
        return '#333';
    }
  }
}