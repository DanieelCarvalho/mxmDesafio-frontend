import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarsService } from '../../services/cars.service';
import { Car } from '../../models/Cars';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  constructor(private servicoDados: CarsService) {}

  @Input() dados: Car[] = [];
  etapa: number = 0;
  size: number = 5;
  sort: string = '';
  modelSearch: string = '';

  // @Output() table = new EventEmitter<any>();
  Id: number | null = null;

  empty: string = '';

  formSubmitted: boolean = false;
  dadosValidos: boolean = false;

  formEdit = new FormGroup({
    modelo: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    ano: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      this.anoValidator,
    ]),
    portas: new FormControl('', Validators.required),
  });
  anoValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && (isNaN(value) || value < 1950 || value > 2025)) {
      return { anoInvalido: true };
    }
    return null;
  }
  table(): void {
    this.servicoDados
      .getCars(this.etapa, this.size, this.modelSearch, this.sort)
      .subscribe((r) => {
        this.dados = r;
        this.servicoDados.listas.next(r);
        console.log(this.size);
      });
    console.log(this.size, 'firt');
  }

  ngOnInit() {
    this.table();
  }

  pageSize(size: number): void {
    this.size = size;
    console.log('Tamanho atualizado:', this.size);
    this.table();
  }

  searchModel(model: string) {
    this.modelSearch = model;
    this.table();
  }

  sortByPrice(): void {
    let asc = 'preco_asc';
    let desc = 'preco_desc';

    if (!this.sort || this.sort === '') {
      this.sort = asc;
    } else {
      if (this.sort === asc) {
        this.sort = desc;
      } else {
        this.sort = '';
      }
    }

    this.table();
  }

  proximaetapa() {
    const proximaEtapa = this.etapa + 1;
    this.servicoDados
      .getCars(proximaEtapa, this.size, this.modelSearch)
      .subscribe((r) => {
        if (r.length > 0) {
          this.etapa++;
          this.table();
        } else {
          console.log('Não há folha disponível para a próxima etapa.');
        }
      });
  }
  etapaAnterior() {
    if (this.etapa > 0) {
      this.etapa--;
      this.table();
    } else {
      console.log('Você já está na primeira etapa.');
    }
  }

  alterar(id: any): any {
    this.Id = id;

    const cars = this.servicoDados.listas.value.filter((car) => {
      return car.id == id; // Use '===' para comparar
    });
    this.formEdit.patchValue({
      modelo: cars[0].modelo,
      preco: cars[0].preco !== undefined ? cars[0].preco.toString() : null,
      ano: cars[0].ano !== undefined ? cars[0].ano.toString() : null,
      portas: cars[0].portas !== undefined ? cars[0].portas.toString() : null,
    });

    console.log(this.Id);
  }

  executarAoEditar(id: number) {
    this.alterar(id);
  }

  updateCar(): any {
    const cars = this.servicoDados.listas.value.filter((tarefa) => {
      return tarefa.id === this.Id;
    });
    const payload = {
      modelo: this.formEdit.value.modelo,
      preco: this.formEdit.value.preco,
      ano: this.formEdit.value.ano,
      portas: this.formEdit.value.portas,
    };
    this.servicoDados.updateCar(payload as Car, this.Id).subscribe((r) => {
      this.table();
    });
    console.log(this.Id);
    // this.form.reset();
  }

  deleteCar(): any {
    const cars = this.servicoDados.listas.value.filter((tarefa) => {
      return tarefa.id === this.Id;
    });
    const payload = {
      modelo: this.formEdit.value.modelo,
      preco: this.formEdit.value.preco,
      ano: this.formEdit.value.ano,
      portas: this.formEdit.value.portas,
    };
    this.servicoDados.deleteCar(this.Id).subscribe((r) => {
      this.table();
    });
  }
}
