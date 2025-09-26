import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/enums/role.enum';

export interface User {
  username: string;
  role: Role;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';  
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password });
  }

  register(newUser: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, newUser);
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem(this.userKey);
    return data ? (JSON.parse(data) as User) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getRole(): Role | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  getToken(): string | null {
    const user = this.getUser();
    return user && user.token ? user.token : null;
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }
}