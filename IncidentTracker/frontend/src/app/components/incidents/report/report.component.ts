import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReportFormComponent } from '../report-form/report-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private marker!: L.Marker;

  private dialog = inject(MatDialog);

  private orangeIcon: L.DivIcon = L.divIcon({
    html: `<span class="material-icons" 
                 style="color: #e67e22; font-size: 30px;">location_on</span>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); 
    }
  }

  private initMap() {
    const existingMap = L.DomUtil.get('map');
    if (existingMap != null) {
      existingMap.innerHTML = '';
    }

    this.map = L.map('map', {
      center: [44.78, 17.19],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = Number(e.latlng.lat.toFixed(6));
      const lng = Number(e.latlng.lng.toFixed(6));
      this.openReportForm(lat, lng);
    });
  }

  openReportForm(lat?: number, lng?: number) {
    if (lat !== undefined && lng !== undefined) {
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng], { icon: this.orangeIcon }).addTo(this.map);
      }

      this.dialog.open(ReportFormComponent, {
        width: '600px',
        data: { latitude: lat, longitude: lng }
      });
    } else {
      this.dialog.open(ReportFormComponent, {
        width: '600px',
        data: { latitude: null, longitude: null }
      });
    }
  }
}