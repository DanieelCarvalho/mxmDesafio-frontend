import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarsService } from '../../services/cars.service';
import { Car } from '../../models/Cars';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  constructor(private servicesCar: CarsService) {}

  @Input() dados: Car[] = [];
  @Input() etapa: number = 0;
  @Input() size: number = 5;
  @Input() modelSearch: string = '';
  @Input() sort: string = '';
  @Output() editarClicked = new EventEmitter<number>();
  @Output() nextpage = new EventEmitter<any>();
  @Output() returnPage = new EventEmitter<any>();
  @Output() pageSize = new EventEmitter<number>();
  @Output() searchModelChange = new EventEmitter<string>();
  @Output() teste = new EventEmitter<any>();

  emitirEventoEditar(id: any) {
    this.editarClicked.emit(id);
  }
  clicaremit() {
    this.teste.emit(this.sort);
  }
  emitiSize() {
    this.pageSize.emit(this.size);
  }
  emitSearch() {
    this.searchModelChange.emit(this.modelSearch);
  }

  emitirTeste() {
    this.nextpage.emit();
  }

  emtiRetorno() {
    this.returnPage.emit();
  }
}
