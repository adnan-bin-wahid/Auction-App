import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuctionService } from '../shared/services/auction.service';
import { ProductService } from '../shared/services/product.service';
import { Auction, CreateAuctionRequest } from '../shared/models/auction.model';
import { Product } from '../shared/models/product.model';
import { AuthService } from '../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-auction-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <button (click)="goBack()" class="btn-back">← Back to Admin Dashboard</button>

      <div class="admin-content">
        <h1>Auction Management</h1>

        <div class="content-grid">
          <div class="form-section">
            <h2>Create New Auction</h2>
            <form (ngSubmit)="submitForm()">
              <div class="form-group">
                <label>Select Product:</label>
                <select [(ngModel)]="formData.productId" name="productId" required>
                  <option value="">-- Select a product --</option>
                  <option *ngFor="let product of products" [value]="product.productId">
                    {{ product.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Start Time:</label>
                <input type="datetime-local" [(ngModel)]="startTimeInput" name="startTime" required />
              </div>
              <div class="form-group">
                <label>End Time:</label>
                <input type="datetime-local" [(ngModel)]="endTimeInput" name="endTime" required />
              </div>
              <div class="button-group">
                <button type="submit" class="btn-primary">Create Auction</button>
                <button type="button" (click)="resetForm()" class="btn-secondary">Clear</button>
              </div>
              <p *ngIf="error" class="error">{{ error }}</p>
              <p *ngIf="success" class="success">{{ success }}</p>
            </form>
          </div>

          <div class="list-section">
            <h2>Active & Upcoming Auctions ({{ auctions.length }})</h2>
            <div class="auctions-list">
              <div *ngFor="let auction of auctions" class="auction-item">
                <div class="auction-info">
                  <h3>{{ auction.product?.name }}</h3>
                  <p class="status" [ngClass]="{'active': auction.status === 'Active'}">
                    Status: {{ auction.status }}
                  </p>
                  <div class="auction-times">
                    <span>Starts: {{ auction.startTime | date: 'short' }}</span>
                    <span>Ends: {{ auction.endTime | date: 'short' }}</span>
                  </div>
                </div>
                <div class="auction-actions">
                  <select [(ngModel)]="statusChange[auction.auctionId]" class="status-select">
                    <option value="">Change Status</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button (click)="updateStatus(auction.auctionId)" class="btn-update">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 1400px;
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .form-section, .list-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-section h2, .list-section h2 {
      margin-top: 0;
      color: #333;
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

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-primary {
      flex: 1;
      padding: 0.75rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary:hover {
      background: #45a049;
    }

    .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-secondary:hover {
      background: #0b7dda;
    }

    .error {
      color: #f44336;
      margin-top: 1rem;
    }

    .success {
      color: #4caf50;
      margin-top: 1rem;
    }

    .auctions-list {
      max-height: 600px;
      overflow-y: auto;
    }

    .auction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      gap: 1rem;
    }

    .auction-item:last-child {
      border-bottom: none;
    }

    .auction-info {
      flex: 1;
    }

    .auction-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
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

    .auction-times {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-size: 0.85rem;
      color: #999;
      margin-top: 0.5rem;
    }

    .auction-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .status-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .btn-update {
      padding: 0.5rem 1rem;
      background: #ff9800;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-update:hover {
      background: #f57c00;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AdminAuctionManagementComponent implements OnInit {
  auctions: Auction[] = [];
  products: Product[] = [];
  error = '';
  success = '';
  statusChange: { [key: number]: string } = {};

  formData: CreateAuctionRequest = {
    productId: 0,
    startTime: '',
    endTime: '',
  };

  startTimeInput = '';
  endTimeInput = '';

  constructor(
    private auctionService: AuctionService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadProducts();
    this.loadAuctions();
  }

  checkAdminAccess(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (!user || user.role !== 'Admin') {
        this.router.navigate(['/admin-dashboard']);
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products || [];
      },
      error: () => {
        this.products = [];
      },
    });
  }

  loadAuctions(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (auctions: Auction[]) => {
        this.auctions = auctions || [];
      },
      error: () => {
        this.auctions = [];
      },
    });
  }

  resetForm(): void {
    this.formData = {
      productId: 0,
      startTime: '',
      endTime: '',
    };
    this.startTimeInput = '';
    this.endTimeInput = '';
    this.error = '';
    this.success = '';
  }

  submitForm(): void {
    this.error = '';
    this.success = '';

    if (this.formData.productId === 0) {
      this.error = 'Please select a product';
      return;
    }

    if (!this.startTimeInput || !this.endTimeInput) {
      this.error = 'Please select start and end times';
      return;
    }

    this.formData.startTime = new Date(this.startTimeInput).toISOString();
    this.formData.endTime = new Date(this.endTimeInput).toISOString();

    this.auctionService.createAuction(this.formData).subscribe({
      next: () => {
        this.success = 'Auction created successfully';
        this.resetForm();
        this.loadAuctions();
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error?.message || 'Failed to create auction';
      },
    });
  }

  updateStatus(auctionId: number): void {
    const newStatus = this.statusChange[auctionId];
    if (!newStatus) {
      this.error = 'Please select a status';
      return;
    }

    this.auctionService.updateAuctionStatus(auctionId, newStatus).subscribe({
      next: () => {
        this.success = 'Auction status updated successfully';
        this.loadAuctions();
        this.statusChange = {};
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error?.message || 'Failed to update auction status';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
