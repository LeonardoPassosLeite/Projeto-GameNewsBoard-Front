import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SideMenuComponent } from '../shared/nav/side-menu/side-menu.component';
import { GameNewsComponent } from '../pages/game-news/game-news.component';
import { AllGamesListComponent } from '../pages/games/all-games-list/all-games-list.component';
import { GameManagementComponent } from '../pages/games/game-management/game-management.component';
export const routes: Routes = [
  {
    path: '',
    component: SideMenuComponent,
    children: [
      {
        path: 'news',
        component: GameNewsComponent,
      },
      {
        path: 'all-games',
        component: AllGamesListComponent,
      },
      {
        path: 'manage-games',
        component: GameManagementComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
