import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';
import { Car } from '../../models/Cars';
import { FormsModule } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CarsService } from '../../services/cars.service';
import { catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-resale',
  standalone: true,
  templateUrl: './resale.component.html',
  styleUrl: './resale.component.css',
  imports: [
    TableComponent,
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FormsModule,
  ],
})
export class ResaleComponent {
  constructor(private servicoDados: CarsService) {}
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  form = new FormGroup({
    modelo: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    ano: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      this.anoValidator,
    ]),
    portas: new FormControl('', Validators.required),
  });

  dados: Car[] = [];
  errors: any = {};
  errorPrice: boolean = false;
  errorAge: boolean = false;

  anoValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && (isNaN(value) || value < 1950 || value > 2025)) {
      return { anoInvalido: true };
    }
    return null;
  }
  updateAndRefreshTable(): void {
    this.tableComponent.table();
  }

  create(): void {
    const payload = {
      modelo: this.form.value.modelo,
      preco: this.form.value.preco,
      ano: this.form.value.ano,
      portas: this.form.value.portas,
    };

    this.servicoDados.create(payload as Car).subscribe(
      (r) => {
        this.tableComponent.etapa = 0;
        this.tableComponent.table();
        this.form.reset();
      },
      (error) => {
        if (error) {
          this.errors = error;
          console.log(this.errors.errors);
          this.errorAge = true;
          this.errorPrice = true;
        }
      }
    );
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

  downloadBlob(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'RevendaCarros.xls';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
