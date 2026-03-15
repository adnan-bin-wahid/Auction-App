import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auction, CreateAuctionRequest } from '../models/auction.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private apiUrl = 'https://localhost:44380/api/auctions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const user = this.authService.getCurrentUser();
    if (user && user.userId) {
      headers = headers.set('X-User-Id', user.userId.toString());
    }
    return headers;
  }

  getAllAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl);
  }

  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`);
  }

  getAuctionByProductId(productId: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/product/${productId}`);
  }

  createAuction(request: CreateAuctionRequest): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, request, { headers: this.getAuthHeaders() });
  }

  updateAuctionStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, JSON.stringify(status), {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json'),
    });
  }

  isAuctionActive(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/active`);
  }
}
