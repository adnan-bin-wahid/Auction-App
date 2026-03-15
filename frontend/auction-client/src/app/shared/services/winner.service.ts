import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuctionWinner } from '../models/winner.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WinnerService {
  private apiUrl = 'https://localhost:44380/api/winners';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const user = this.authService.getCurrentUser();
    if (user && user.userId) {
      headers = headers.set('X-User-Id', user.userId.toString());
    }
    return headers;
  }

  assignWinner(auctionId: number): Observable<AuctionWinner> {
    return this.http.post<AuctionWinner>(
      `${this.apiUrl}/assign-winner/${auctionId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getWinnerByAuction(auctionId: number): Observable<AuctionWinner> {
    return this.http.get<AuctionWinner>(`${this.apiUrl}/auction/${auctionId}`);
  }

  getWinnersByUser(userId: number): Observable<AuctionWinner[]> {
    return this.http.get<AuctionWinner[]>(`${this.apiUrl}/user/${userId}`);
  }

  deleteWinner(winnerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${winnerId}`, { headers: this.getAuthHeaders() });
  }
}
