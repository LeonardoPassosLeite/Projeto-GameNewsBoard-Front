import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ErrorHandlingService } from './commons/error-handling.service';
import { ApiResponse } from '../models/commons/api-response.model';
import { GameReleaseResponse } from '../models/game-release.model';

@Injectable({ providedIn: 'root' })
export class GameReleaseService {
  private readonly baseUrl = `${environment.apiBaseUrl}/GameRelease`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  getUpcomingGames(daysAhead: number = 7): Observable<GameReleaseResponse[]> {
    const params = new HttpParams().set('daysAhead', daysAhead.toString());

    return this.http
      .get<ApiResponse<GameReleaseResponse[]>>(`${this.baseUrl}/upcoming`, { params })
      .pipe(
        map((response) => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Erro ao carregar lançamentos futuros.');
          }
          return response.data;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  getRecentGames(daysBack: number = 7): Observable<GameReleaseResponse[]> {
    const params = new HttpParams().set('daysBack', daysBack.toString());

    return this.http
      .get<ApiResponse<GameReleaseResponse[]>>(`${this.baseUrl}/recent`, { params })
      .pipe(
        map((response) => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Erro ao carregar lançamentos recentes.');
          }
          return response.data;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }
}
