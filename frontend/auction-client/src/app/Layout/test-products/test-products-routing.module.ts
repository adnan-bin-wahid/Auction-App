import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestProductsShellComponent } from './test-products-shell.component';
import { TestProductListComponent } from './test-product-list/test-product-list.component';
import { TestProductAddComponent } from './test-product-add/test-product-add.component';

const routes: Routes = [
  {
    path: '',
    component: TestProductsShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: TestProductListComponent,
      },
      {
        path: 'add',
        component: TestProductAddComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestProductsRoutingModule {}
