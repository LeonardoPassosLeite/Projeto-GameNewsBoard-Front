import { Component, OnInit } from '@angular/core';
import { IgdbGameService } from '../../../shared/services/igdb-game.service';
import { GameResponse } from '../../../shared/models/game.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../../shared/constants/pagination.constants';
import { GamerLoadingComponent } from '../../../shared/components/gamer-loading/gamer-loading.component';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { DropdownComponent } from '../../../shared/forms/dropdown/dropdown.component';
import { debounceTime, Subject } from 'rxjs';
import { IgdbPlatform, getPlatformOptions } from '../../../shared/enums/igdb-platform.enum';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-all-games-list',
  standalone: true,
  imports: [
    GenericModule,
    GamerLoadingComponent,
    InputComponent,
    DropdownComponent,
    PaginationComponent,
  ],
  templateUrl: './all-games-list.component.html',
  styleUrls: ['./all-games-list.component.scss'],
})
export class AllGamesListComponent implements OnInit {
  games: GameResponse[] = [];
  message: string | null = null;
  searchTerm: string = '';
  selectedPlatform: IgdbPlatform = IgdbPlatform.All;
  platformOptions = getPlatformOptions();
  private searchSubject = new Subject<string>();
  years: { id: number | null; name: string }[] = [];
  selectedYear: number | null = null;
  page = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;
  hasMoreGames = false;
  isLoading = false;

  constructor(private igdbGameService: IgdbGameService) {}

  ngOnInit(): void {
    this.generateYearOptions();
    this.loadGames();
    this.searchSubject.pipe(debounceTime(600)).subscribe((value) => {
      this.executeSearch(value, this.selectedPlatform, this.selectedYear ?? undefined);
    });
  }

  // Load games with pagination and search term
  loadGames(): void {
    this.isLoading = true;
    this.igdbGameService.getGames(this.page, this.pageSize).subscribe({
      next: (res) => this.handleResponse(res),
      error: (err) => this.handleError(err),
    });
  }

  // Execute search with applied filters
  private executeSearch(name: string, platform?: number, year?: number): void {
    this.isLoading = true;
    this.igdbGameService.searchGames(name, platform, year, this.page, this.pageSize).subscribe({
      next: (res) => this.handleResponse(res),
      error: (err) => this.handleError(err),
    });
  }

  // Handle response for both game loading and search
  private handleResponse(res: any): void {
    const data = res?.data ?? { items: [], page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE };

    // Não aplique mais o filtro no front-end
    this.games = data.items; // Apenas atribuindo os itens retornados

    this.hasMoreGames = data.items.length === this.pageSize;
    this.message = res.message || 'Nenhum jogo encontrado.';
    this.isLoading = false;
  }

  // Handle errors in game loading and search
  private handleError(err: any): void {
    this.message = err?.error?.message || err?.message || 'Erro inesperado.';
    this.games = [];
    this.isLoading = false;
  }

  // On search term change, trigger search
  onSearch(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  // On platform change, trigger search with the selected platform
  onPlatformChange(platformId: number | null): void {
    this.selectedPlatform = platformId ?? IgdbPlatform.All;
    this.executeSearch(this.searchTerm, this.selectedPlatform, this.selectedYear ?? undefined);
  }

  // On year change, trigger search with the selected year
  onYearChange(year: number | null): void {
    this.selectedYear = year;
    this.executeSearch(this.searchTerm, this.selectedPlatform, year ?? undefined);
  }

  // Generate the year options for the dropdown
  private generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    const recentYears = Array.from({ length: 15 }, (_, i) => currentYear - i);

    this.years = [
      { id: null, name: 'Todos' },
      ...recentYears.map((year) => ({ id: year, name: year.toString() })),
    ];
  }

  // Handle previous page click
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.executeSearch(this.searchTerm, this.selectedPlatform, this.selectedYear ?? undefined);
    }
  }

  // Handle next page click
  nextPage(): void {
    if (this.hasMoreGames) {
      this.page++;
      this.executeSearch(this.searchTerm, this.selectedPlatform, this.selectedYear ?? undefined);
    }
  }
}
