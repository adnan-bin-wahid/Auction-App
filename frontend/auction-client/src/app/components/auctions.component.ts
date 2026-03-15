import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auction } from '../shared/models/auction.model';
import { AuctionService } from '../shared/services/auction.service';
import { BidService } from '../shared/services/bid.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auctions-container">
      <h1>Available Auctions</h1>

      <div *ngIf="isLoading" class="loading">Loading auctions...</div>

      <div *ngIf="!isLoading && auctions.length === 0" class="no-auctions">
        <p>No auctions available at the moment.</p>
      </div>

      <div class="auctions-grid">
        <div *ngFor="let auction of auctions" class="auction-card">
          <div class="product-name">{{ auction.product?.name }}</div>
          <div class="product-details">
            <p><strong>Description:</strong> {{ auction.product?.description }}</p>
            <p>
              <strong>Starting Price:</strong> \${{
                auction.product?.startingPrice | number: '1.2-2'
              }}
            </p>
            <p>
              <strong>Actual Price:</strong> \${{ auction.product?.actualPrice | number: '1.2-2' }}
            </p>
          </div>

          <div class="auction-timing">
            <p>
              <strong>Status:</strong>
              <span
                [class.active]="auction.status === 'Active'"
                [class.ended]="auction.status !== 'Active'"
              >
                {{ auction.status }}
              </span>
            </p>
            <p><strong>Starts:</strong> {{ auction.startTime | date: 'short' }}</p>
            <p><strong>Ends:</strong> {{ auction.endTime | date: 'short' }}</p>
          </div>

          <div class="auction-actions">
            <button (click)="viewDetails(auction.auctionId)" class="btn-primary">
              View Details
            </button>
            <button
              (click)="viewBids(auction.auctionId)"
              class="btn-secondary"
              *ngIf="currentUser?.role === 'Admin'"
            >
              View Bids
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auctions-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
      }

      .loading,
      .no-auctions {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      .auctions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .auction-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s;
      }

      .auction-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .product-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1rem;
      }

      .product-details {
        margin-bottom: 1rem;
        color: #666;
        font-size: 0.9rem;
      }

      .product-details p {
        margin: 0.5rem 0;
      }

      .auction-timing {
        margin-bottom: 1rem;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .auction-timing p {
        margin: 0.5rem 0;
      }

      .auction-timing .active {
        color: #4caf50;
        font-weight: 600;
      }

      .auction-timing .ended {
        color: #f44336;
        font-weight: 600;
      }

      .auction-actions {
        display: flex;
        gap: 0.5rem;
        flex-direction: column;
      }

      button {
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s;
      }

      .btn-primary {
        background: #667eea;
        color: white;
      }

      .btn-primary:hover {
        background: #5568d3;
      }

      .btn-secondary {
        background: #f0f0f0;
        color: #333;
      }

      .btn-secondary:hover {
        background: #e0e0e0;
      }
    `,
  ],
})
export class AuctionsComponent implements OnInit {
  auctions: Auction[] = [];
  isLoading = true;
  currentUser: any;

  constructor(
    private auctionService: AuctionService,
    private bidService: BidService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (data: Auction[]) => {
        this.auctions = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading auctions:', error);
        this.isLoading = false;
      },
    });
  }

  viewDetails(auctionId: number): void {
    this.router.navigate(['/auction', auctionId]);
  }

  viewBids(auctionId: number): void {
    console.log('View bids for auction:', auctionId);
    // Show bids for admin - navigate to activity monitor
    this.router.navigate(['/activity-monitor']);
  }
}
