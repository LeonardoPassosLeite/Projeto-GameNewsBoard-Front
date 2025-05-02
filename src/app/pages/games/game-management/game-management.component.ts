import { Component } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../../../shared/nav/nav-bar/nav-bar.component';

@Component({
  selector: 'app-game-management',
  standalone: true,
  imports: [GenericModule, RouterModule, NavBarComponent],
  templateUrl: './game-management.component.html',
  styleUrl: './game-management.component.scss',
})
export class GameManagementComponent {}