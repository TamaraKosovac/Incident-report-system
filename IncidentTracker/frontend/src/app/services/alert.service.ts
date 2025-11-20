import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

export interface AlertConfig {
  radiusMeters: number;
  timeWindowMinutes: number;
  minIncidents: number;
  lookbackDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private baseUrl = 'http://localhost:8080/api/alerts';
  private configUrl = 'http://localhost:8080/api/alerts/config';

  constructor(private http: HttpClient) {}

  getUnread(moderatorId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/unread?moderatorId=${moderatorId}`);
  }

  getUnreadCount(moderatorId: number) {
    return this.http.get(`${this.baseUrl}/unread/count?moderatorId=${moderatorId}`, {
      responseType: 'text'
    }).pipe(map(text => Number(text)));
  }

  markAsRead(moderatorId: number, alertId: number) {
    return this.http.post(`${this.baseUrl}/${alertId}/read?moderatorId=${moderatorId}`, {});
  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getConfig() {
    return this.http.get<AlertConfig>(this.configUrl);
  }

  updateConfig(model: AlertConfig) {
    return this.http.put(this.configUrl, model);
  }
}