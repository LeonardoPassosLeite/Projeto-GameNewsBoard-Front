import { Component, OnInit } from '@angular/core';
import { GameReleaseResponse } from '../../shared/models/game-release.model';
import { GameReleaseService } from '../../shared/services/game-releaseService';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';

@Component({
  selector: 'app-game-releases',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './game-releases.component.html',
  styleUrl: './game-releases.component.scss',
})
export class GameReleasesComponent implements OnInit {
  upcomingGames: GameReleaseResponse[] = [];
  recentGames: GameReleaseResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private gameReleaseService: GameReleaseService) {}

  ngOnInit(): void {
    this.loadReleases();
  }

  loadReleases(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.gameReleaseService.getUpcomingGames(10).subscribe({
      next: (games) => (this.upcomingGames = games),
      error: (err) => (this.errorMessage = 'Erro ao carregar lançamentos futuros'),
      complete: () => (this.isLoading = false),
    });

    this.gameReleaseService.getRecentGames(10).subscribe({
      next: (games) => (this.recentGames = games),
      error: (err) => (this.errorMessage = 'Erro ao carregar lançamentos recentes'),
    });
  }
}
