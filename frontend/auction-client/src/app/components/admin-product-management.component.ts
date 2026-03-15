import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { Product, CreateProductRequest } from '../shared/models/product.model';
import { AuthService } from '../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <button (click)="goBack()" class="btn-back">← Back to Admin Dashboard</button>

      <div class="admin-content">
        <h1>Product Management</h1>

        <div class="content-grid">
          <div class="form-section">
            <h2>{{ editingId ? 'Edit Product' : 'Create New Product' }}</h2>
            <form (ngSubmit)="submitForm()">
              <div class="form-group">
                <label>Product Name:</label>
                <input type="text" [(ngModel)]="formData.name" name="name" required />
              </div>
              <div class="form-group">
                <label>Description:</label>
                <textarea [(ngModel)]="formData.description" name="description" required></textarea>
              </div>
              <div class="form-group">
                <label>Starting Price:</label>
                <input type="number" [(ngModel)]="formData.startingPrice" name="startingPrice" min="0" step="0.01" required />
              </div>
              <div class="form-group">
                <label>Actual Value:</label>
                <input type="number" [(ngModel)]="formData.actualPrice" name="actualPrice" min="0" step="0.01" required />
              </div>
              <div class="form-group">
                <label>Image URL:</label>
                <input type="text" [(ngModel)]="formData.imageUrl" name="imageUrl" />
              </div>
              <div class="button-group">
                <button type="submit" class="btn-primary">{{ editingId ? 'Update' : 'Create' }} Product</button>
                <button type="button" (click)="resetForm()" class="btn-secondary">Clear</button>
              </div>
              <p *ngIf="error" class="error">{{ error }}</p>
              <p *ngIf="success" class="success">{{ success }}</p>
            </form>
          </div>

          <div class="list-section">
            <h2>Existing Products ({{ products.length }})</h2>
            <div class="products-list">
              <div *ngFor="let product of products" class="product-item">
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p>{{ product.description }}</p>
                  <div class="product-details">
                    <span>Starting: {{ product.startingPrice | number: '1.2-2' }}</span>
                    <span>Value: {{ product.actualPrice | number: '1.2-2' }}</span>
                  </div>
                </div>
                <div class="product-actions">
                  <button (click)="editProduct(product)" class="btn-edit">Edit</button>
                  <button (click)="deleteProduct(product.productId)" class="btn-delete">Delete</button>
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
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
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

    .products-list {
      max-height: 600px;
      overflow-y: auto;
    }

    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      gap: 1rem;
    }

    .product-item:last-child {
      border-bottom: none;
    }

    .product-info {
      flex: 1;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .product-info p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .product-details {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;
      color: #999;
    }

    .product-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit {
      padding: 0.5rem 1rem;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-edit:hover {
      background: #0b7dda;
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

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AdminProductManagementComponent implements OnInit {
  products: Product[] = [];
  editingId: number | null = null;
  error = '';
  success = '';

  formData: CreateProductRequest = {
    name: '',
    description: '',
    startingPrice: 0,
    actualPrice: 0,
    imageUrl: '',
  };

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadProducts();
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

  editProduct(product: Product): void {
    this.editingId = product.productId;
    this.formData = {
      name: product.name,
      description: product.description,
      startingPrice: product.startingPrice,
      actualPrice: product.actualPrice,
      imageUrl: product.imageUrl || '',
    };
  }

  resetForm(): void {
    this.editingId = null;
    this.formData = {
      name: '',
      description: '',
      startingPrice: 0,
      actualPrice: 0,
      imageUrl: '',
    };
    this.error = '';
    this.success = '';
  }

  submitForm(): void {
    this.error = '';
    this.success = '';

    if (!this.formData.name || !this.formData.description) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, this.formData).subscribe({
        next: () => {
          this.success = 'Product updated successfully';
          this.resetForm();
          this.loadProducts();
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.error?.message || 'Failed to update product';
        },
      });
    } else {
      this.productService.createProduct(this.formData).subscribe({
        next: () => {
          this.success = 'Product created successfully';
          this.resetForm();
          this.loadProducts();
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.error?.message || 'Failed to create product';
        },
      });
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.success = 'Product deleted successfully';
          this.loadProducts();
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.error?.message || 'Failed to delete product';
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
