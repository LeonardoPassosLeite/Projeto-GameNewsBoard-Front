import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PaginatedResult } from '../models/commons/paginated-result.model';
import { GameResponse } from '../models/game.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../constants/pagination.constants';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class IgdbGameService {
  private readonly baseUrl = `${environment.apiBaseUrl}/games`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getGames(
    page: number = DEFAULT_PAGE,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Observable<ApiResponse<PaginatedResult<GameResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<PaginatedResult<GameResponse>>>(this.baseUrl, { params })
      .pipe(
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  searchGames(
    name?: string,
    platform?: number,
    year?: number,
    page: number = DEFAULT_PAGE,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Observable<ApiResponse<PaginatedResult<GameResponse>>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    if (name?.trim()) {
      params = params.set('name', name);
    }

    if (platform !== undefined && platform !== null) {
      params = params.set('platform', platform.toString());
    }

    if (year !== undefined && year !== null) {
      params = params.set('year', year.toString());
    }

    return this.http
      .get<ApiResponse<PaginatedResult<GameResponse>>>(
        `${this.baseUrl}/search`,
        { params }
      )
      .pipe(
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }
}
