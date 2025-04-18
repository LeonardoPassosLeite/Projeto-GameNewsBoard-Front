import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() label: string = 'Buscar';
  @Input() placeholder: string = 'Pesquisar...';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
