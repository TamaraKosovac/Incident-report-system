import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    const decoded: any = jwtDecode(token);
    return decoded.userId;
  }

  getCurrentUser(): Observable<any> {
    const userId = this.getUserIdFromToken();
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateProfile(model: any): Observable<any> {
    const userId = this.getUserIdFromToken();
    return this.http.put(`${this.apiUrl}/${userId}`, model);
  }
}