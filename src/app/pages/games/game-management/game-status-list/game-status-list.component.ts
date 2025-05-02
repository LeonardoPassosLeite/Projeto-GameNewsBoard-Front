import { Component } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { GameCarouselComponent } from '../../../../shared/components/game-carousel/game-carousel.component';
import { GameResponse } from '../../../../shared/models/game.model';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game-status-list',
  standalone: true,
  imports: [GenericModule, GameCarouselComponent, DragDropModule],
  templateUrl: './game-status-list.component.html',
  styleUrl: './game-status-list.component.scss',
})
export class GameStatusListComponent {
  statusGames: { [status: string]: GameResponse[] } = {};
  dropListIds: string[] = [];
  statusList = ['Jogando', 'Zerado', 'Dropado', 'Favorito'];

}
