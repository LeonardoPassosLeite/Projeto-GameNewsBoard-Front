import { Routes } from '@angular/router';
import { SideMenuComponent } from '../shared/nav/side-menu/side-menu.component';
import { GameNewsComponent } from '../pages/game-news/game-news.component';
import { AllGamesListComponent } from '../pages/games/all-games-list/all-games-list.component';
import { GameManagementComponent } from '../pages/games/game-management/game-management.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { GuestGuard } from './auth/guards/guest.guard';
import { LoginComponent } from './auth/login/login.component';
import { UserRegisterComponent } from './auth/login/user-register/user-register.component';
import { NavBarComponent } from '../shared/nav/nav-bar/nav-bar.component';
import { AddGameTierListComponent } from '../pages/games/game-management/game-tier-list/add-game-tier-list/add-game-tier-list.component';
import { TierListFormComponent } from '../pages/games/game-management/game-tier-list/tier-list-form/tier-list-form.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
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
        path: 'nav-bar',
        component: NavBarComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'tier-list',
          },
          {
            path: 'tier-list',
            loadComponent: () =>
              import('../pages/games/game-management/game-tier-list/game-tier-list.component').then(
                (m) => m.GameTierListComponent
              ),
          },
          {
            path: 'status-list',
            loadComponent: () =>
              import(
                '../pages/games/game-management/game-status-list/game-status-list.component'
              ).then((m) => m.GameStatusListComponent),
          },
        ],
      },
      {
        path: 'manage-games/tier-list/create-tier-list',
        component: TierListFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-games/tier-list/edit-tier-list/:tierId',
        component: TierListFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-games/tier-list/add-game-tier-list/:tierId',
        component: AddGameTierListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-games',
        component: GameManagementComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: '/nav-bar/tier-list',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];
