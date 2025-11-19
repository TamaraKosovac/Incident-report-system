import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private apiUrl = 'http://localhost:8080/api/analytics'; 

  constructor(private http: HttpClient) {}

  count24h(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/time/24h`);
  }

  count7d(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/time/7d`);
  }

  count30d(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/time/30d`);
  }

  total(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/time/total`);
  }

  daily(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/time/daily`);
  }

  topLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/location/top`);
  }

  getPoints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/location/points`);
  }

  countInRadius(lat: number, lng: number, radius: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/location/radius?lat=${lat}&lng=${lng}&radiusMeters=${radius}`
    );
  }

  types(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type`);
  }

  subtypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subtype`);
  }

  top5Types(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type/top`);
  }
}