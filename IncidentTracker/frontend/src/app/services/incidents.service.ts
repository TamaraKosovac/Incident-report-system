import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Incident {
  id?: number;
  type: string;
  subtype: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  private apiUrl = 'http://localhost:8080/api/incidents'; 

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  createIncident(incident: any): Observable<Incident> {
    const formData = new FormData();
    formData.append('type', incident.type);
    formData.append('subtype', incident.subtype);
    formData.append('description', incident.description);
    if (incident.latitude) {
      formData.append('latitude', incident.latitude.toString());
    }
    if (incident.longitude) {
      formData.append('longitude', incident.longitude.toString());
    }
    if (incident.image) {
      formData.append('image', incident.image, incident.image.name);
    }

    return this.http.post<Incident>(this.apiUrl, formData);
  }
}
