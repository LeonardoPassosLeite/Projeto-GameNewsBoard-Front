import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../../../shared/services/commons/game-data.service';
import { GameResponse } from '../../../shared/models/game.model';
import { GameFilters } from '../../../shared/models/commons/game-filters.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../../shared/constants/pagination.constants';
import { GamerLoadingComponent } from '../../../shared/components/gamer-loading/gamer-loading.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { GameSearchFilterComponent } from '../../../shared/forms/game-search-filter/game-search-filter.component';
import { Platform } from '../../../shared/enums/platform.enum';
import { YearCategory } from '../../../shared/enums/year-category.enum';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-all-games-list',
  standalone: true,
  imports: [GenericModule, GamerLoadingComponent, PaginationComponent, GameSearchFilterComponent],
  templateUrl: './all-games-list.component.html',
  styleUrls: ['./all-games-list.component.scss']
})
export class AllGamesListComponent implements OnInit {
  games: GameResponse[] = [];
  message: string | null = null;
  isLoading = false;
  hasMoreGames = false;

  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All
  };

  page = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  private filtersChanged$ = new Subject<GameFilters>();

  constructor(private gameDataService: GameDataService) {}

  ngOnInit(): void {
    this.loadGames();

    this.filtersChanged$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(filters => {
        this.filters = { ...filters };
        this.page = DEFAULT_PAGE;
        this.loadGames();
      });
  }

  loadGames(): void {
    this.isLoading = true;

    this.gameDataService
      .loadGames(this.page, this.pageSize, this.filters.platform, this.filters.yearCategory, this.filters.searchTerm)
      .subscribe({
        next: res => this.handleResponse(res),
        error: err => this.handleError(err)
      });
  }

  private handleResponse(res: any): void {
    const data = res?.data ?? { items: [], page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE };
    this.games = data.items;
    this.hasMoreGames = data.items.length === this.pageSize;
    this.message = res.message || 'Nenhum jogo encontrado.';
    this.isLoading = false;
  }

  private handleError(err: any): void {
    this.message = err?.error?.message || err?.message || 'Erro inesperado.';
    this.games = [];
    this.isLoading = false;
  }

  onFiltersChanged(filters: GameFilters): void {
    this.filters = { ...filters };
    this.page = DEFAULT_PAGE;
    this.loadGames();
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadGames();
    }
  }

  nextPage(): void {
    if (this.hasMoreGames) {
      this.page++;
      this.loadGames();
    }
  }

  getReleaseYear(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    return parts.length === 3 ? parts[2] : null;
  }
}
