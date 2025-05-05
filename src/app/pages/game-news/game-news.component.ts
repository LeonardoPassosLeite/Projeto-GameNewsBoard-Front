import { Component, OnInit } from '@angular/core';
import { GameNewsArticle } from '../../shared/models/games-news.model';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { GameNewsFeaturedComponent } from './game-news-featured/game-news-featured.component';
import { GameNewsListComponent } from './game-news-list/game-news-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXbox, faPlaystation, faSteam } from '@fortawesome/free-brands-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { GameNewsService } from '../../shared/services/game-news.service';

@Component({
  selector: 'app-game-news',
  standalone: true,
  imports: [GenericModule, GameNewsFeaturedComponent, GameNewsListComponent, FontAwesomeModule],
  templateUrl: './game-news.component.html',
  styleUrls: ['./game-news.component.scss'],
})
export class GameNewsComponent implements OnInit {
  news: GameNewsArticle[] = [];

  platforms = [
    { value: 'xbox', icon: faXbox },
    { value: 'ps5', icon: faPlaystation },
    { value: 'pc', icon: faSteam },
    { value: 'nintendo', icon: faGamepad },
  ];

  selectedPlatform = 'xbox';

  constructor(private gamesNewsService: GameNewsService) {}

  get slicedNews(): GameNewsArticle[] {
    return this.news?.slice(1) ?? [];
  }

  ngOnInit(): void {
    this.loadGameNews(this.selectedPlatform);
  }

  loadGameNews(platform: string) {
    this.selectedPlatform = platform;
    this.gamesNewsService.getNewsByPlatform(platform).subscribe({
      next: (response) => {
        if (response.success) {
          this.news = response.data.articles;
        } else {
          console.error('Erro ao carregar notícias:', response.message);
        }
      },
      error: (err) => console.error('Erro ao buscar notícias', err),
    });
  }
}