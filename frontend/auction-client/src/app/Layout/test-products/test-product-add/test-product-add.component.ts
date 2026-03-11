import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TestProductsService } from '../../../shared/services/test-products.service';

@Component({
  selector: 'app-test-product-add',
  templateUrl: './test-product-add.component.html',
  styleUrl: './test-product-add.component.css',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestProductAddComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly testProductsService = inject(TestProductsService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.testProductsService
      .addProduct(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.successMessage.set(`Product created successfully with ID ${product.id}.`);
          this.form.reset({ name: '' });
          this.isSubmitting.set(false);
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message || 'Unable to create product.');
          this.isSubmitting.set(false);
        },
      });
  }
}
