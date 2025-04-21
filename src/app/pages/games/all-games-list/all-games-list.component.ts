import { Component, OnInit } from '@angular/core';
import { IgdbGameService } from '../../../shared/services/igdb-game.service';
import { GameResponse } from '../../../shared/models/game.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../../../shared/constants/pagination.constants';
import { GamerLoadingComponent } from '../../../shared/components/gamer-loading/gamer-loading.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { FilterMenuComponent } from '../../../shared/forms/filter-menu/filter-menu.component';
import { Platform } from '../../../shared/enums/platform.enum';
import { YearCategory } from '../../../shared/enums/year-category.enum';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-all-games-list',
  standalone: true,
  imports: [
    GenericModule,
    GamerLoadingComponent,
    FilterMenuComponent,
    PaginationComponent,
    InputComponent,
  ],
  templateUrl: './all-games-list.component.html',
  styleUrls: ['./all-games-list.component.scss'],
})
export class AllGamesListComponent implements OnInit {
  games: GameResponse[] = [];
  message: string | null = null;

  page = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;
  hasMoreGames = false;
  isLoading = false;

  platformOptions = Object.keys(Platform)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      platform: Platform[key as keyof typeof Platform],
      name: key.replace(/([A-Z])/g, ' $1').trim(),
    }));

  yearCategoryOptions = Object.keys(YearCategory).map((key) => ({
    category: YearCategory[key as keyof typeof YearCategory],
    name: key.replace(/([A-Z])/g, ' $1').trim(),
  }));

  searchTerm: string = '';
  searchTerm$ = new Subject<string>();
  selectedPlatforms: Platform = Platform.All;
  selectedYearCategory: YearCategory = YearCategory.All;

  constructor(private igdbGameService: IgdbGameService) {}

  ngOnInit(): void {
    this.searchTerm$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term;
        this.page = DEFAULT_PAGE;
        this.loadGames(this.selectedPlatforms, this.selectedYearCategory);
      });

    this.loadGames(this.selectedPlatforms, this.selectedYearCategory);
  }

  loadGames(platforms: Platform, yearCategory: YearCategory): void {
    this.isLoading = true;
  
    const isPlatformFilter = platforms !== Platform.All;
    const isYearFilter = yearCategory !== YearCategory.All;
    const isSearchTerm = this.searchTerm.trim().length > 0;
  
    if (isPlatformFilter) {
      this.igdbGameService
        .getGamesByPlatform(this.page, this.pageSize, platforms, this.searchTerm)
        .subscribe({
          next: (res) => this.handleResponse(res),
          error: (err) => this.handleError(err),
        });
  
    } else if (isYearFilter || isSearchTerm) {
      this.igdbGameService
        .getGamesByYearCategory(this.page, this.pageSize, yearCategory, this.searchTerm)
        .subscribe({
          next: (res) => this.handleResponse(res),
          error: (err) => this.handleError(err),
        });
  
    } else {
      this.igdbGameService
        .getGames(this.page, this.pageSize)
        .subscribe({
          next: (res) => this.handleResponse(res),
          error: (err) => this.handleError(err),
        });
    }
  }
  
  private handleResponse(res: any): void {
    const data = res?.data ?? {
      items: [],
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    };

    this.games = data.items;
    this.hasMoreGames = data.items.length === this.pageSize;
    this.message = res.message || 'Nenhum jogo encontrado.';
    this.isLoading = false;

    console.log('[Busca] Jogos retornados:', this.games);
  }

  private handleError(err: any): void {
    this.message = err?.error?.message || err?.message || 'Erro inesperado.';
    this.games = [];
    this.isLoading = false;
  }

  onSearchTermChanged(term: string): void {
    this.searchTerm$.next(term);
  }

  onFilterMenuApplied(filters: {
    platforms: Platform;
    yearCategory: YearCategory;
  }): void {
    this.selectedPlatforms = filters.platforms;
    this.selectedYearCategory = filters.yearCategory;
    this.page = DEFAULT_PAGE;

    this.loadGames(this.selectedPlatforms, this.selectedYearCategory);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadGames(this.selectedPlatforms, this.selectedYearCategory);
    }
  }

  nextPage(): void {
    if (this.hasMoreGames) {
      this.page++;
      this.loadGames(this.selectedPlatforms, this.selectedYearCategory);
    }
  }

  getReleaseYear(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;

    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return parts[2];
    }

    return null;
  }
}
