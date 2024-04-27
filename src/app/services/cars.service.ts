import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Car } from '../models/Cars';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  // private url: string = 'https://localhost:7125/Revendas';
  private url: string = 'https://backend-deploy-car.azurewebsites.net/revendas';
  constructor(private http: HttpClient) {}

  public listas = new BehaviorSubject<Car[]>([]);

  create(obj: Car): Observable<Car> {
    return this.http.post(`${this.url}/create`, obj).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }

  getCars(
    p: number,
    s: number,
    modelo: string = '',
    sort?: string
  ): Observable<Car[]> {
    let apiUrl = `${this.url}/getCars`;

    apiUrl += `?page=${p}&size=${s}`;
    if (modelo) {
      apiUrl += `&modelo=${modelo}`;
    }
    if (sort) {
      apiUrl += `&sort=${sort}`;
    }

    return this.http.get<Car[]>(apiUrl);
  }

  updateCar(obj: Car, id: any): Observable<Car> {
    return this.http.put(`${this.url}/${id}`, obj);
  }

  deleteCar(id: any): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }

  export(): Observable<Blob> {
    return this.http.get(`${this.url}/export`, { responseType: 'blob' });
  }
}
