import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-test-products-shell',
  templateUrl: './test-products-shell.component.html',
  styleUrl: './test-products-shell.component.css',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestProductsShellComponent {}
