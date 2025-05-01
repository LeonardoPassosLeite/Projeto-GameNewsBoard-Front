import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { ErrorHandlingService } from './commons/error-handling.service';
import { ApiResponse } from '../models/commons/api-response.model';
import { UserProfileResponse } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiBaseUrl}/user`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  getAuthenticatedUserSafe(): Observable<UserProfileResponse | null> {
    return this.http.get<ApiResponse<UserProfileResponse>>(`${this.baseUrl}/me`, {
      withCredentials: true
    }).pipe(
      map(response => {
        return response.data;
      }),
      catchError(err => {
        return of(null);
      })
    );
  }  
  
  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<ApiResponse<UserProfileResponse>>(`${this.baseUrl}/profile`).pipe(
      map(response => response.data),
      catchError(err => {
        const errorMsg = this.errorHandler.handleHttpError(err);
        throw new Error(errorMsg);
      })
    );
  }
}
