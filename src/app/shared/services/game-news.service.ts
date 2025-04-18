import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameNewsResponse } from '../models/games-news.model';

@Injectable({
  providedIn: 'root',
})
export class GameNewsService {
  private readonly baseUrl = 'http://localhost:5140/api/GameNews';

  constructor(private http: HttpClient) {}

  getNewsByPlatform(platform: string): Observable<GameNewsResponse> {
    return this.http.get<GameNewsResponse>(`${this.baseUrl}/${platform}`);
  }
}
