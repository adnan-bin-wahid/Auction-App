import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService } from '../shared/services/auction.service';
import { BidService } from '../shared/services/bid.service';
import { AuthService } from '../shared/services/auth.service';
import { Auction } from '../shared/models/auction.model';
import { CreateBidRequest } from '../shared/models/bid.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auction-detail-container" *ngIf="auction">
      <button (click)="goBack()" class="btn-back">← Back to Auctions</button>

      <div class="auction-main">
        <div class="auction-header">
          <h1>{{ auction.product?.name }}</h1>
          <p class="status" [ngClass]="{ active: auction.status === 'Active' }">
            Status: {{ auction.status }}
          </p>
        </div>

        <div class="auction-details">
          <div class="detail-row">
            <span class="label">Starting Price:</span>
            <span class="value">{{ auction.product?.startingPrice | number: '1.2-2' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Actual Value:</span>
            <span class="value">{{ auction.product?.actualPrice | number: '1.2-2' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Starts:</span>
            <span class="value">{{ auction.startTime | date: 'short' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Ends:</span>
            <span class="value">{{ auction.endTime | date: 'short' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Description:</span>
            <span class="value">{{ auction.product?.description }}</span>
          </div>
        </div>

        <div *ngIf="currentUser && canBid()" class="bid-form-container">
          <h2>Place Your Bid</h2>
          <form (ngSubmit)="submitBid()">
            <div class="form-group">
              <label
                >Bid Amount (minimum {{ auction.product?.startingPrice | number: '1.2-2' }}):</label
              >
              <input
                type="number"
                [(ngModel)]="bidAmount"
                name="bidAmount"
                [min]="auction.product?.startingPrice ?? 0"
                placeholder="Enter bid amount"
                required
              />
            </div>
            <button type="submit" class="btn-bid">Place Bid</button>
          </form>
          <p *ngIf="bidError" class="error">{{ bidError }}</p>
          <p *ngIf="bidSuccess" class="success">{{ bidSuccess }}</p>
        </div>

        <div *ngIf="!currentUser" class="login-prompt">
          <p>Please login to place a bid</p>
        </div>

        <div *ngIf="currentUser && !canBid()" class="auction-ended">
          <p>This auction has ended</p>
        </div>
      </div>

      <div class="bids-section">
        <h2>Recent Bids</h2>
        <div class="bids-list">
          <div *ngFor="let bid of bids" class="bid-item">
            <div>
              Bid: <strong>{{ bid.bidAmount | number: '1.2-2' }}</strong>
            </div>
            <div>Time: {{ bid.bidTime | date: 'short' }}</div>
          </div>
        </div>
        <p *ngIf="bids.length === 0" class="no-bids">No bids yet</p>
      </div>
    </div>
  `,
  styles: [
    `
      .auction-detail-container {
        padding: 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }

      .btn-back {
        background: #667eea;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 2rem;
      }

      .btn-back:hover {
        background: #5568d3;
      }

      .auction-main {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .auction-header h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .status {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        display: inline-block;
        background: #ffccbc;
        color: #d84315;
      }

      .status.active {
        background: #c8e6c9;
        color: #2e7d32;
      }

      .auction-details {
        margin: 1.5rem 0;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 4px;
      }

      .detail-row {
        display: flex;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;
      }

      .detail-row:last-child {
        border-bottom: none;
      }

      .label {
        font-weight: 600;
        width: 150px;
        color: #666;
      }

      .value {
        flex: 1;
        color: #333;
      }

      .bid-form-container {
        background: #f5f5f5;
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 2rem;
      }

      .bid-form-container h2 {
        margin-top: 0;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #333;
      }

      .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .btn-bid {
        width: 100%;
        padding: 0.75rem;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
      }

      .btn-bid:hover {
        background: #45a049;
      }

      .error {
        color: #f44336;
        margin-top: 0.5rem;
      }

      .success {
        color: #4caf50;
        margin-top: 0.5rem;
      }

      .login-prompt,
      .auction-ended {
        background: #fff3cd;
        padding: 1.5rem;
        border-radius: 4px;
        color: #856404;
        text-align: center;
        margin-top: 2rem;
      }

      .bids-section {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .bids-section h2 {
        margin-top: 0;
      }

      .bids-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .bid-item {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
      }

      .bid-item:last-child {
        border-bottom: none;
      }

      .no-bids {
        text-align: center;
        color: #999;
        padding: 2rem;
      }
    `,
  ],
})
export class AuctionDetailComponent implements OnInit {
  auction: Auction | null = null;
  bids: any[] = [];
  currentUser: any = null;
  bidAmount = 0;
  bidError = '';
  bidSuccess = '';

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
    private bidService: BidService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.loadAuction(id);
        this.loadBids(id);
      }
    });
  }

  loadAuction(id: number): void {
    this.auctionService.getAuctionById(id).subscribe({
      next: (auction: Auction) => {
        this.auction = auction;
      },
      error: () => {
        alert('Failed to load auction');
      },
    });
  }

  loadBids(auctionId: number): void {
    this.bidService.getBidsForAuction(auctionId).subscribe({
      next: (bids: any[]) => {
        this.bids = bids || [];
      },
      error: () => {
        this.bids = [];
      },
    });
  }

  canBid(): boolean {
    return this.auction?.status === 'Active';
  }

  submitBid(): void {
    this.bidError = '';
    this.bidSuccess = '';

    if (!this.auction || !this.auction.auctionId) {
      this.bidError = 'Invalid auction';
      return;
    }

    if (this.bidAmount <= 0) {
      this.bidError = 'Please enter a valid bid amount';
      return;
    }

    const minPrice = this.auction.product?.startingPrice || 0;
    if (this.bidAmount < minPrice) {
      this.bidError = 'Bid must be at least ' + minPrice;
      return;
    }

    const request: CreateBidRequest = {
      auctionId: this.auction.auctionId,
      userId: this.currentUser.userId,
      bidAmount: this.bidAmount,
    };

    this.bidService.placeBid(request).subscribe({
      next: () => {
        this.bidSuccess = 'Bid placed successfully!';
        this.bidAmount = 0;
        this.loadBids(this.auction!.auctionId);
        setTimeout(() => {
          this.bidSuccess = '';
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.bidError = error.error?.message || 'Failed to place bid';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/auctions']);
  }
}
