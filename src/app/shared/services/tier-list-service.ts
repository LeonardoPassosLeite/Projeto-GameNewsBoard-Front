import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../models/commons/api-response.model';
import { ErrorHandlingService } from './commons/error-handling.service';
import { TierListRequest, TierListResponse } from '../models/tier-list.model';

@Injectable({ providedIn: 'root' })
export class TierListService {
  private readonly baseUrl = `${environment.apiBaseUrl}/TierList`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {}

  createTierList(request: TierListRequest): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}`, request)
      .pipe(catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler)));
  }

  addGameToTier(tierListId: string, gameId: number, tier: number): Observable<void> {
    const params = new HttpParams().set('gameId', gameId.toString()).set('tier', tier.toString());

    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/${tierListId}/add-game`, {}, { params })
      .pipe(
        map((response) => {
          if (!response.success) throw new Error('Erro ao adicionar jogo no tier.');
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  updateGameTier(tierListId: string, gameId: number, tier: number): Observable<void> {
    const params = new URLSearchParams({
      gameId: gameId.toString(),
      newTier: tier.toString(),
    });

    return this.http
      .patch<ApiResponse<any>>(`${this.baseUrl}/${tierListId}/update-game?${params.toString()}`, {})
      .pipe(
        map((response) => {
          if (!response.success) throw new Error('Erro ao atualizar o tier do jogo.');
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  removeGameFromTier(tierListId: string, gameId: number): Observable<void> {
    const params = new HttpParams().set('gameId', gameId.toString());

    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/${tierListId}/remove-game`, { params })
      .pipe(
        map((response) => {
          if (!response.success) throw new Error('Erro ao remover jogo do tier.');
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  uploadImage(image: File): Observable<{ imageUrl: string; imageId: string }> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http
      .post<ApiResponse<{ imageUrl: string; imageId: string }>>(
        `${this.baseUrl}/upload-image`,
        formData
      )
      .pipe(
        map((res) => {
          if (!res || !res.success || !res.data || !res.data.imageUrl || !res.data.imageId)
            throw new Error('Resposta de upload inválida.');

          return res.data;
        }),
        catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
      );
  }

  getTierById(tierId: string): Observable<TierListResponse> {
    return this.http.get<ApiResponse<TierListResponse>>(`${this.baseUrl}/${tierId}`).pipe(
      map((response) => {
        if (!response.success || !response.data) throw new Error('Erro ao carregar tier.');

        return response.data;
      }),
      catchError(this.errorHandler.handleWithThrow.bind(this.errorHandler))
    );
  }
}
