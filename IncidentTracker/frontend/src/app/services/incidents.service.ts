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

  getMyIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/my`);
  }

  createIncident(incident: any): Observable<Incident> {
    const formData = new FormData();
    formData.append('type', incident.type);

    if (incident.subtype) {
      formData.append('subtype', incident.subtype);
    }

    formData.append('description', incident.description);

    if (incident.location?.address) {
      formData.append('location.address', incident.location.address);
    }
    if (incident.location?.latitude !== null && incident.location?.latitude !== undefined) {
      formData.append('location.latitude', incident.location.latitude.toString());
    }
    if (incident.location?.longitude !== null && incident.location?.longitude !== undefined) {
      formData.append('location.longitude', incident.location.longitude.toString());
    }

    if (incident.image) {
      formData.append('image', incident.image, incident.image.name);
    }

    for (const pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    return this.http.post<Incident>(this.apiUrl, formData);
  }

  getApprovedIncidentsFiltered(
    type?: string,
    subtype?: string,
    location?: string,
    period: string = 'all'
  ): Observable<Incident[]> {
    const params: any = {};

    if (type) params.type = type;
    if (subtype) params.subtype = subtype;
    if (location) params.location = location;
    if (period) params.period = period;

    return this.http.get<Incident[]>(`${this.apiUrl}/approved`, { params });
  }

  approveIncident(id: number): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectIncident(id: number): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}/reject`, {});
  }
}