import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, RegisterResponse } from './auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const payload = { email, password };
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, payload);
  }

  register(email: string, password: string, role: string): Observable<RegisterResponse> {
    const payload = { email, password, role}
    return this.http.post<RegisterResponse>(`${this.API_URL}/users/register`, payload);
  }
}