import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TestProduct } from '../../../shared/models/test-product.model';
import { TestProductsService } from '../../../shared/services/test-products.service';

@Component({
  selector: 'app-test-product-list',
  templateUrl: './test-product-list.component.html',
  styleUrl: './test-product-list.component.css',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestProductListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly testProductsService = inject(TestProductsService);

  readonly products = signal<TestProduct[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.testProductsService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message || 'Unable to load products.');
          this.isLoading.set(false);
        },
      });
  }
}
