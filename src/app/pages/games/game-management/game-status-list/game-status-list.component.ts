import { Component } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { GameCarouselComponent } from '../../../../shared/components/game-carousel/game-carousel.component';

@Component({
  selector: 'app-game-status-list',
  standalone: true,
  imports: [GenericModule, GameCarouselComponent],
  templateUrl: './game-status-list.component.html',
  styleUrl: './game-status-list.component.scss',
})
export class GameStatusListComponent {
  dropListIds: string[] = [];
}
