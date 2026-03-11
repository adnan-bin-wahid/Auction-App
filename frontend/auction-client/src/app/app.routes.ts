import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'test-products/list',
  },
  {
    path: 'test-products',
    loadChildren: () =>
      import('./Layout/test-products/test-products.module').then(
        (module) => module.TestProductsModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'test-products/list',
  },
];
