import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { GameDataService } from '../../../shared/services/commons/game-data.service';
import { GameResponse } from '../../models/game.model';
import { GameFilters } from '../../../shared/models/commons/game-filters.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { GamerLoadingComponent } from '../gamer-loading/gamer-loading.component';
import { GameSearchFilterComponent } from '../../forms/game-search-filter/game-search-filter.component';
import { Platform } from '../../enums/platform.enum';
import { YearCategory } from '../../enums/year-category.enum';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/pagination.constants';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { faPlay, faPause, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-game-carousel',
  standalone: true,
  imports: [
    GenericModule, 
    GamerLoadingComponent,
    GameSearchFilterComponent,
    DragDropModule,
    FontAwesomeModule
  ],
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.scss'],
})
export class GameCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() connectedDropLists: string[] = [];

  games: GameResponse[] = [];
  filteredGames: GameResponse[] = [];
  isLoading = true;
  isPaused = false;
  page = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  faPlay = faPlay;
  faPause = faPause;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  filters: GameFilters = {
    searchTerm: '',
    platform: Platform.All,
    yearCategory: YearCategory.All,
  };

  private scrollInterval: any;
  private loadSubscription?: Subscription;
  private filtersChanged$ = new Subject<GameFilters>();

  @ViewChild('carouselContainer', { static: false })
  carouselContainerRef!: ElementRef<HTMLDivElement>;

  constructor(private gameDataService: GameDataService) {}

  ngOnInit(): void {
    this.loadGames();

    this.filtersChanged$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((filters) => {
        this.filters = { ...filters };
        this.loadFilteredGames();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.games.length > 0) {
        this.startAutoScroll();
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
    this.loadSubscription?.unsubscribe();
  }

  private loadGames(): void {
    this.isLoading = true;

    this.loadSubscription = this.gameDataService
      .loadGames(1, 100, Platform.All, YearCategory.All, '')
      .subscribe({
        next: (response) => {
          const newGames = response.data.items;
          this.games = [...newGames, ...newGames];
          this.filteredGames = [...this.games];
          this.isLoading = false;
          this.waitForContainerAndScroll();
        },
        error: (error) => {
          console.error('[Carousel] Erro ao carregar jogos:', error);
          this.isLoading = false;
        },
      });
  }

  private loadFilteredGames(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }

    const { searchTerm, platform, yearCategory } = this.filters;
    const hasSearchTerm = searchTerm.trim().length > 0;

    if (!hasSearchTerm && platform === Platform.All && yearCategory === YearCategory.All) {
      this.filteredGames = [...this.games];
      this.waitForContainerAndScroll();
      return;
    }

    this.isLoading = true;

    this.gameDataService
      .loadGames(this.page, this.pageSize, platform, yearCategory, searchTerm)
      .subscribe({
        next: (response) => {
          this.filteredGames = response.data.items;
          this.isLoading = false;
          this.waitForContainerAndScroll();
        },
        error: (error) => {
          console.error('[Carousel] Erro ao buscar jogos:', error);
          this.filteredGames = [];
          this.isLoading = false;
        },
      });
  }

  private startAutoScroll(): void {
    if (!this.carouselContainerRef?.nativeElement) {
      console.warn('[Carousel] Container não encontrado.');
      return;
    }

    const container = this.carouselContainerRef.nativeElement;

    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }

    this.scrollInterval = setInterval(() => {
      if (this.isPaused) {
        clearInterval(this.scrollInterval);
        return;
      }

      container.scrollLeft += 10;
      const halfScrollWidth = container.scrollWidth / 2;

      if (container.scrollLeft >= halfScrollWidth) {
        container.scrollLeft = 0;
      }
    }, 20);
  }

  private waitForContainerAndScroll(retries = 10): void {
    if (this.carouselContainerRef?.nativeElement) {
      this.startAutoScroll();
    } else if (retries > 0) {
      setTimeout(() => this.waitForContainerAndScroll(retries - 1), 100);
    }
  }

  onFiltersChanged(filters: GameFilters): void {
    this.filtersChanged$.next(filters);
  }

  toggleScroll(): void {
    this.isPaused = !this.isPaused;

    if (!this.isPaused) {
      this.startAutoScroll();
    } else if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  scrollLeft(): void {
    if (this.carouselContainerRef?.nativeElement) {
      this.carouselContainerRef.nativeElement.scrollLeft -= 100;
    }
  }

  scrollRight(): void {
    if (this.carouselContainerRef?.nativeElement) {
      this.carouselContainerRef.nativeElement.scrollLeft += 100;
    }
  }

  getFullCoverUrl(coverImage: string): string {
    if (!coverImage) {
      return '';
    }
    return coverImage.replace('t_thumb', 't_cover_big');
  }

  onDragStarted(game: GameResponse): void {
    console.log('[Carousel] Iniciou drag do jogo:', game.id, '-', game.title);
  }
}