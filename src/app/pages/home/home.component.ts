import { Component, model } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CarsService } from '../../services/cars.service';
import { CommonModule } from '@angular/common';
import { retry } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, RouterLink],
})
export class HomeComponent {
  constructor(private servicoDados: CarsService) {}
}
