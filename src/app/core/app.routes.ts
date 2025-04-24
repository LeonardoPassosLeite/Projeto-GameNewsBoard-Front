import { Routes } from '@angular/router';
import { SideMenuComponent } from '../shared/nav/side-menu/side-menu.component';
import { GameNewsComponent } from '../pages/game-news/game-news.component';
import { AllGamesListComponent } from '../pages/games/all-games-list/all-games-list.component';
import { GameManagementComponent } from '../pages/games/game-management/game-management.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { GuestGuard } from './auth/guards/guest.guard';
import { LoginComponent } from './auth/login/login.component';
import { UserRegisterComponent } from './auth/login/user-register/user-register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,

  },
  {
    path: 'register',
    component: UserRegisterComponent,
    canActivate: [GuestGuard],
  },
  {
    path: '',
    component: SideMenuComponent,
    children: [
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full',
      },
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
        canActivate: [AuthGuard],
      },
    ],
  },
];
