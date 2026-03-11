import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTestProductRequest, TestProduct } from '../models/test-product.model';

@Injectable({
  providedIn: 'root',
})
export class TestProductsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/TestProducts';

  getProducts(): Observable<TestProduct[]> {
    return this.http.get<TestProduct[]>(this.endpoint);
  }

  addProduct(payload: CreateTestProductRequest): Observable<TestProduct> {
    return this.http.post<TestProduct>(this.endpoint, payload);
  }
}
