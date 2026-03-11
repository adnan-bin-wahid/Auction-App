import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TestProduct {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:44380/api/TestProducts';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<TestProduct[]> {
    return this.http.get<TestProduct[]>(this.apiUrl);
  }

  addProduct(product: TestProduct): Observable<TestProduct> {
    return this.http.post<TestProduct>(this.apiUrl, product);
  }
}