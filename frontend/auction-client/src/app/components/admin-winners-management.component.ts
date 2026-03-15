import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WinnerService } from '../shared/services/winner.service';
import { AuctionService } from '../shared/services/auction.service';
import { AuthService } from '../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-winners-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <button (click)="goBack()" class="btn-back">← Back to Admin Dashboard</button>

      <div class="admin-content">
        <h1>Winners Management</h1>

        <div class="winners-stats">
          <div class="stat-card">
            <div class="stat-value">{{ totalWinners }}</div>
            <div class="stat-label">Total Winners Assigned</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalWinnings | number: '1.2-2' }}</div>
            <div class="stat-label">Total Winnings Amount</div>
          </div>
        </div>

        <div class="winners-section">
          <h2>Auction Winners</h2>
          <div class="winners-list">
            <div *ngFor="let winner of winners" class="winner-item">
              <div class="winner-info">
                <h3>Auction ID: {{ winner.auctionId }}</h3>
                <div class="winner-details">
                  <span><strong>User ID:</strong> {{ winner.userId }}</span>
                  <span><strong>Winning Amount:</strong> {{ winner.winningAmount | number: '1.2-2' }}</span>
                </div>
                <div class="winner-timestamp">
                  Assigned at: {{ winner.assignedAt | date: 'medium' }}
                </div>
              </div>
              <div class="winner-actions">
                <button (click)="removeWinner(winner.winnerId)" class="btn-delete">
                  Remove Winner
                </button>
              </div>
            </div>
          </div>
          <p *ngIf="winners.length === 0" class="no-data">No winners assigned yet</p>
        </div>

        <div class="pending-auctions">
          <h2>Auctions Without Winners</h2>
          <div class="auctions-list">
            <div *ngFor="let auction of closedAuctionsWithoutWinners" class="auction-card">
              <h3>Auction ID: {{ auction.auctionId }}</h3>
              <div class="auction-info">
                <span><strong>Product:</strong> {{ auction.product?.name }}</span>
                <span><strong>Status:</strong> {{ auction.status }}</span>
                <span><strong>Highest Bid:</strong> {{ auction.highestBid | number: '1.2-2' }}</span>
              </div>
              <button 
                (click)="assignWinner(auction.auctionId)"
                [disabled]="!auction.highestBid || assigningWinnerId === auction.auctionId"
                class="btn-assign"
              >
                {{ assigningWinnerId === auction.auctionId ? 'Assigning...' : 'Assign Winner' }}
              </button>
            </div>
          </div>
          <p *ngIf="closedAuctionsWithoutWinners.length === 0" class="no-data">All closed auctions have winners assigned</p>
        </div>

        <p *ngIf="error" class="error">{{ error }}</p>
        <p *ngIf="success" class="success">{{ success }}</p>
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

    .winners-stats {
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

    .winners-section, .pending-auctions {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .winners-section h2, .pending-auctions h2 {
      margin-top: 0;
      color: #333;
    }

    .winners-list {
      max-height: 500px;
      overflow-y: auto;
    }

    .winner-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      gap: 1rem;
    }

    .winner-item:last-child {
      border-bottom: none;
    }

    .winner-info {
      flex: 1;
    }

    .winner-info h3 {
      margin: 0 0 0.75rem 0;
      color: #333;
    }

    .winner-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .winner-timestamp {
      font-size: 0.85rem;
      color: #999;
    }

    .winner-actions {
      display: flex;
    }

    .btn-delete {
      padding: 0.5rem 1rem;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-delete:hover {
      background: #da190b;
    }

    .auctions-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .auction-card {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
    }

    .auction-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .auction-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .btn-assign {
      width: 100%;
      padding: 0.75rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-assign:hover:not(:disabled) {
      background: #45a049;
    }

    .btn-assign:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error {
      color: #f44336;
      margin-top: 1rem;
      padding: 1rem;
      background: #ffebee;
      border-radius: 4px;
    }

    .success {
      color: #4caf50;
      margin-top: 1rem;
      padding: 1rem;
      background: #e8f5e9;
      border-radius: 4px;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 2rem;
    }
  `],
})
export class AdminWinnersManagementComponent implements OnInit {
  winners: any[] = [];
  closedAuctionsWithoutWinners: any[] = [];
  totalWinners = 0;
  totalWinnings = 0;
  error = '';
  success = '';
  assigningWinnerId: number | null = null;

  constructor(
    private winnerService: WinnerService,
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadWinners();
    this.loadClosedAuctionsWithoutWinners();
  }

  checkAdminAccess(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (!user || user.role !== 'Admin') {
        this.router.navigate(['/admin-dashboard']);
      }
    });
  }

  loadWinners(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (auctions: any[]) => {
        let allWinners: any[] = [];
        let totalAmount = 0;

        auctions.forEach((auction) => {
          this.winnerService.getWinnerByAuction(auction.auctionId).subscribe({
            next: (winner: any) => {
              if (winner) {
                allWinners.push(winner);
                totalAmount += winner.winningAmount;
                this.winners = allWinners;
                this.totalWinners = allWinners.length;
                this.totalWinnings = totalAmount;
              }
            },
            error: () => {},
          });
        });
      },
      error: () => {},
    });
  }

  loadClosedAuctionsWithoutWinners(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (auctions: any[]) => {
        const closedAuctions = auctions.filter((a) => a.status === 'Closed');
        const auctionsWithoutWinners: any[] = [];

        closedAuctions.forEach((auction) => {
          this.winnerService.getWinnerByAuction(auction.auctionId).subscribe({
            next: (winner) => {
              if (!winner) {
                // Get highest bid for this auction
                const product = auction.product;
                auctionsWithoutWinners.push({
                  auctionId: auction.auctionId,
                  product: product,
                  status: auction.status,
                  highestBid: 0,
                });
                this.closedAuctionsWithoutWinners = auctionsWithoutWinners;
              }
            },
            error: () => {},
          });
        });
      },
      error: () => {},
    });
  }

  assignWinner(auctionId: number): void {
    this.error = '';
    this.success = '';
    this.assigningWinnerId = auctionId;

    this.winnerService.assignWinner(auctionId).subscribe({
      next: () => {
        this.success = 'Winner assigned successfully';
        this.assigningWinnerId = null;
        setTimeout(() => {
          this.success = '';
        }, 3000);
        this.loadWinners();
        this.loadClosedAuctionsWithoutWinners();
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error?.message || 'Failed to assign winner';
        this.assigningWinnerId = null;
      },
    });
  }

  removeWinner(winnerId: number): void {
    if (confirm('Are you sure you want to remove this winner assignment?')) {
      this.error = '';
      this.success = '';

      this.winnerService.deleteWinner(winnerId).subscribe({
        next: () => {
          this.success = 'Winner removed successfully';
          setTimeout(() => {
            this.success = '';
          }, 3000);
          this.loadWinners();
          this.loadClosedAuctionsWithoutWinners();
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.error?.message || 'Failed to remove winner';
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
