import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bid, CreateBidRequest, AdminBid } from '../models/bid.model';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  private apiUrl = 'https://localhost:44380/api/bids';

  constructor(private http: HttpClient) {}

  placeBid(request: CreateBidRequest): Observable<Bid> {
    return this.http.post<Bid>(this.apiUrl, request);
  }

  getBidById(id: number): Observable<Bid> {
    return this.http.get<Bid>(`${this.apiUrl}/${id}`);
  }

  getBidsForAuction(auctionId: number): Observable<AdminBid[]> {
    return this.http.get<AdminBid[]>(`${this.apiUrl}/auction/${auctionId}`);
  }

  getUserBidHistory(userId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.apiUrl}/user/${userId}/history`);
  }

  getHighestBid(auctionId: number): Observable<Bid> {
    return this.http.get<Bid>(`${this.apiUrl}/auction/${auctionId}/highest`);
  }
}
