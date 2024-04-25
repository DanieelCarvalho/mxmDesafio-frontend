import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ResaleComponent } from './pages/resale/resale.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'revendas', component: ResaleComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
