import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BidService } from '../shared/services/bid.service';
import { AuctionService } from '../shared/services/auction.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin-bid-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <button (click)="goBack()" class="btn-back">← Back to Admin Dashboard</button>

      <div class="admin-content">
        <h1>Bid Activity Monitor</h1>

        <div class="activity-stats">
          <div class="stat-card">
            <div class="stat-value">{{ totalBids }}</div>
            <div class="stat-label">Total Bids</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ activeBids }}</div>
            <div class="stat-label">Active Auction Bids</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ highestBidAmount | number: '1.2-2' }}</div>
            <div class="stat-label">Highest Bid Amount</div>
          </div>
        </div>

        <div class="activity-section">
          <h2>Recent Bid Activity</h2>
          <div class="activity-list">
            <div *ngFor="let bid of recentBids" class="activity-item">
              <div class="bid-time">{{ bid.bidTime | date: 'medium' }}</div>
              <div class="bid-details">
                <strong>Auction ID: {{ bid.auctionId }}</strong>
                <span class="bid-amount">Bid: {{ bid.bidAmount | number: '1.2-2' }}</span>
              </div>
              <div class="bid-user">
                <span class="user-badge">User ID: {{ bid.userId }}</span>
              </div>
            </div>
          </div>
          <p *ngIf="recentBids.length === 0" class="no-data">No bid activity yet</p>
        </div>

        <div class="auction-bids">
          <h2>Bids by Auction</h2>
          <div class="auction-stats">
            <div *ngFor="let auction of auctionBidStats" class="auction-bid-card">
              <h3>Auction ID: {{ auction.auctionId }}</h3>
              <div class="bid-stats">
                <div>Total Bids: <strong>{{ auction.bidCount }}</strong></div>
                <div>Highest Bid: <strong>{{ auction.highestBid | number: '1.2-2' }}</strong></div>
                <div>Status: <span class="status" [ngClass]="{'active': auction.status === 'Active'}">
                  {{ auction.status }}
                </span></div>
              </div>
            </div>
          </div>
          <p *ngIf="auctionBidStats.length === 0" class="no-data">No auctions with bids</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 1200px;
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

    .admin-content h1 {
      color: #333;
      margin-bottom: 2rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 0.5rem;
    }

    .activity-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .activity-section, .auction-bids {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .activity-section h2, .auction-bids h2 {
      margin-top: 0;
      color: #333;
    }

    .activity-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .activity-item {
      display: grid;
      grid-template-columns: 150px 1fr 150px;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      align-items: center;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .bid-time {
      font-size: 0.85rem;
      color: #999;
      font-weight: 600;
    }

    .bid-details {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .bid-details strong {
      color: #333;
    }

    .bid-amount {
      color: #4caf50;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .bid-user {
      text-align: right;
    }

    .user-badge {
      background: #f5f5f5;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      color: #666;
    }

    .auction-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .auction-bid-card {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .auction-bid-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .bid-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .bid-stats > div {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
    }

    .status {
      display: inline-block;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      background: #ffccbc;
      color: #d84315;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .status.active {
      background: #c8e6c9;
      color: #2e7d32;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 2rem;
    }
  `],
})
export class AdminBidActivityComponent implements OnInit {
  recentBids: any[] = [];
  auctionBidStats: any[] = [];
  totalBids = 0;
  activeBids = 0;
  highestBidAmount = 0;

  constructor(
    private bidService: BidService,
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadBidActivity();
    this.loadAuctionStats();
  }

  checkAdminAccess(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (!user || user.role !== 'Admin') {
        this.router.navigate(['/admin-dashboard']);
      }
    });
  }

  loadBidActivity(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (auctions: any[]) => {
        let allBids: any[] = [];
        let highestBid = 0;
        let activeBidCount = 0;

        auctions.forEach((auction) => {
          this.bidService.getBidsForAuction(auction.auctionId).subscribe({
            next: (bids: any[]) => {
              allBids = allBids.concat(bids);
              this.recentBids = allBids.sort((a, b) => {
                return new Date(b.bidTime).getTime() - new Date(a.bidTime).getTime();
              }).slice(0, 20);
              
              this.totalBids = allBids.length;
              bids.forEach((bid) => {
                if (bid.bidAmount > highestBid) {
                  highestBid = bid.bidAmount;
                }
                if (auction.status === 'Active') {
                  activeBidCount++;
                }
              });
              this.highestBidAmount = highestBid;
              this.activeBids = activeBidCount;
            },
            error: () => {},
          });
        });
      },
      error: () => {},
    });
  }

  loadAuctionStats(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (auctions: any[]) => {
        this.auctionBidStats = [];
        auctions.forEach((auction) => {
          this.bidService.getBidsForAuction(auction.auctionId).subscribe({
            next: (bids: any[]) => {
              if (bids.length > 0) {
                const highestBid = Math.max(...bids.map((b) => b.bidAmount));
                this.auctionBidStats.push({
                  auctionId: auction.auctionId,
                  bidCount: bids.length,
                  highestBid: highestBid,
                  status: auction.status,
                });
              }
            },
            error: () => {},
          });
        });
      },
      error: () => {},
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
