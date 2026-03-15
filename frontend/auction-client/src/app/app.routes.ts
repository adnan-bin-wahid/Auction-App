import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { AuctionsComponent } from './components/auctions.component';
import { AuctionDetailComponent } from './components/auction-detail.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { AdminProductManagementComponent } from './components/admin-product-management.component';
import { AdminAuctionManagementComponent } from './components/admin-auction-management.component';
import { AdminBidActivityComponent } from './components/admin-bid-activity.component';
import { AdminWinnersManagementComponent } from './components/admin-winners-management.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auctions',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'auctions',
    component: AuctionsComponent,
  },
  {
    path: 'auction/:id',
    component: AuctionDetailComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'admin/products',
    component: AdminProductManagementComponent,
  },
  {
    path: 'admin/auctions',
    component: AdminAuctionManagementComponent,
  },
  {
    path: 'admin/bid-activity',
    component: AdminBidActivityComponent,
  },
  {
    path: 'admin/winners',
    component: AdminWinnersManagementComponent,
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
    redirectTo: 'auctions',
  },
];
