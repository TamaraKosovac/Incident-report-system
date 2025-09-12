import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident } from '../models/incident.model';

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
    if (incident.subtype) {
      formData.append('subtype', incident.subtype);
    }
    formData.append('description', incident.description);

    if (incident.location?.latitude) {
      formData.append('latitude', incident.location.latitude.toString());
    }
    if (incident.location?.longitude) {
      formData.append('longitude', incident.location.longitude.toString());
    }
    if (incident.image) {
      formData.append('image', incident.image, incident.image.name);
    }

    return this.http.post<Incident>(this.apiUrl, formData);
  }
}
