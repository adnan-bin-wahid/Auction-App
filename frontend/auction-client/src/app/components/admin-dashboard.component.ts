import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { AuctionService } from '../shared/services/auction.service';
import { BidService } from '../shared/services/bid.service';
import { WinnerService } from '../shared/services/winner.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <div *ngIf="!isAdmin" class="access-denied">
        <h1>Access Denied</h1>
        <p>You do not have permission to access the admin dashboard.</p>
      </div>

      <div *ngIf="isAdmin" class="admin-dashboard">
        <h1>Admin Dashboard</h1>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ productCount }}</div>
            <div class="stat-label">Products</div>
            <button (click)="navigateTo('/admin/products')" class="btn-action">
              Manage Products
            </button>
          </div>

          <div class="stat-card">
            <div class="stat-number">{{ auctionCount }}</div>
            <div class="stat-label">Auctions</div>
            <button (click)="navigateTo('/admin/auctions')" class="btn-action">
              Manage Auctions
            </button>
          </div>

          <div class="stat-card">
            <div class="stat-number">{{ bidCount }}</div>
            <div class="stat-label">Total Bids</div>
            <button (click)="navigateTo('/admin/bid-activity')" class="btn-action">
              View Activity
            </button>
          </div>

          <div class="stat-card">
            <div class="stat-number">{{ winnerCount }}</div>
            <div class="stat-label">Winners Assigned</div>
            <button (click)="navigateTo('/admin/winners')" class="btn-action">
              Manage Winners
            </button>
          </div>
        </div>

        <div class="admin-quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button (click)="navigateTo('/admin/products')" class="btn-primary">
              Create New Product
            </button>
            <button (click)="navigateTo('/admin/auctions')" class="btn-primary">
              Create New Auction
            </button>
            <button (click)="refreshStats()" class="btn-secondary">Refresh Stats</button>
          </div>
        </div>

        <div class="admin-info">
          <h2>Admin Information</h2>
          <p>Welcome, {{ currentUserName }}!</p>
          <p>All administrative functions are accessible from this dashboard.</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .access-denied {
        background: #ffebee;
        border: 2px solid #f44336;
        border-radius: 8px;
        padding: 3rem;
        text-align: center;
        color: #c62828;
      }

      .access-denied h1 {
        margin: 0 0 1rem 0;
      }

      .admin-dashboard h1 {
        color: #333;
        margin-bottom: 2rem;
        border-bottom: 3px solid #667eea;
        padding-bottom: 0.5rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 1.5rem;
        font-weight: 500;
      }

      .btn-action {
        width: 100%;
        padding: 0.75rem 1rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        transition: background 0.3s ease;
      }

      .btn-action:hover {
        background: #5568d3;
      }

      .admin-quick-actions {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .admin-quick-actions h2 {
        margin-top: 0;
        color: #333;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .btn-primary {
        padding: 0.75rem 1.5rem;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        transition: background 0.3s ease;
      }

      .btn-primary:hover {
        background: #45a049;
      }

      .btn-secondary {
        padding: 0.75rem 1.5rem;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        transition: background 0.3s ease;
      }

      .btn-secondary:hover {
        background: #0b7dda;
      }

      .admin-info {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        border-radius: 4px;
        padding: 2rem;
        color: #0d47a1;
      }

      .admin-info h2 {
        margin-top: 0;
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  productCount = 0;
  auctionCount = 0;
  bidCount = 0;
  winnerCount = 0;
  currentUserName = '';
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private auctionService: AuctionService,
    private bidService: BidService,
    private winnerService: WinnerService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.loadStats();
  }

  checkAdminStatus(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (!user || user.role !== 'Admin') {
        this.isAdmin = false;
        return;
      }
      this.isAdmin = true;
      this.currentUserName = user.name;
    });
  }

  loadStats(): void {
    if (!this.isAdmin) {
      return;
    }

    if (this.productService) {
      this.productService.getAllProducts().subscribe({
        next: (products) => {
          this.productCount = products.length;
        },
        error: () => {
          this.productCount = 0;
        },
      });
    }

    if (this.auctionService) {
      this.auctionService.getAllAuctions().subscribe({
        next: (auctions) => {
          this.auctionCount = auctions.length;
        },
        error: () => {
          this.auctionCount = 0;
        },
      });
    }
  }

  refreshStats(): void {
    this.loadStats();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
