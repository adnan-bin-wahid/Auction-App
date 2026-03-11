import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TestProductsRoutingModule } from './test-products-routing.module';
import { TestProductsShellComponent } from './test-products-shell.component';
import { TestProductListComponent } from './test-product-list/test-product-list.component';
import { TestProductAddComponent } from './test-product-add/test-product-add.component';

@NgModule({
  declarations: [TestProductsShellComponent, TestProductListComponent, TestProductAddComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TestProductsRoutingModule],
})
export class TestProductsModule {}
