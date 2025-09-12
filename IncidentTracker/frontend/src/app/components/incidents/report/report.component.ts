import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReportFormComponent } from '../report-form/report-form.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker;

  private dialog = inject(MatDialog);

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map', {
      center: [44.78, 17.19], 
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // klik na mapu otvara formu
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.openReportForm(e.latlng.lat, e.latlng.lng);
    });
  }

  openReportForm(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    this.dialog.open(ReportFormComponent, {
      width: '600px',
      data: { latitude: lat, longitude: lng }
    });
  }
}
