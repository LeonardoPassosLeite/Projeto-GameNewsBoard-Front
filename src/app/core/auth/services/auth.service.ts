import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { ApiResponse } from '../../../shared/models/commons/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: { username: string; password: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/register`, data);
  }

  login(data: { username: string; password: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/login`, data);
  }

  logout(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/logout`, {});
  }

  getProfile(): Observable<{
    authenticated: boolean;
    username: string;
    userId: string;
  }> {
    return this.http
      .get<
        ApiResponse<{
          authenticated: boolean;
          username: string;
          userId: string;
        }>
      >(`${this.baseUrl}/me`)
      .pipe(map(res => res.data));
  }
}
