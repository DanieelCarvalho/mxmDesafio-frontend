import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';
import { Component } from '@angular/core';
import { Car } from '../../models/Cars';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CarsService } from '../../services/cars.service';

@Component({
  selector: 'app-resale',
  standalone: true,
  imports: [
    TableComponent,
    TableComponent,
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
  ],
  templateUrl: './resale.component.html',
  styleUrl: './resale.component.css',
})
export class ResaleComponent {
  constructor(private servicoDados: CarsService) {}

  form = new FormGroup({
    modelo: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    ano: new FormControl('', Validators.required),
    portas: new FormControl('', Validators.required),
  });

  formEdit = new FormGroup({
    modelo: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    ano: new FormControl('', Validators.required),
    portas: new FormControl('', Validators.required),
  });
  Id: number | null = null;
  etapa: number = 0;
  size: number = 5;
  dados: Car[] = [];
  modelSearch: string = '';
  empty: string = '';
  sort: string = '';

  table(): void {
    this.servicoDados
      .getCars(this.etapa, this.size, this.modelSearch, this.sort)
      .subscribe((r) => {
        this.dados = r;
        this.servicoDados.listas.next(r);
      });
  }

  ngOnInit() {
    this.table();
  }

  pageSize(size: number): void {
    this.size = size;
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
  create(): void {
    const payload = {
      modelo: this.form.value.modelo,
      preco: this.form.value.preco,
      ano: this.form.value.ano,
      portas: this.form.value.portas,
    };

    this.servicoDados.create(payload as Car).subscribe((r) => {
      this.table();
    });

    this.form.reset();
  }
  alterar(id: number): any {
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
    this.form.reset();
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

  export(): void {
    this.servicoDados.export()?.subscribe(
      (blobData: Blob) => {
        this.downloadBlob(blobData);
      },
      (error) => {
        console.error('Erro ao exportar dados:', error);
      }
    );
  }

  private downloadBlob(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'arquivo_exportado.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
