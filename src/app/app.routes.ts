import { Routes } from '@angular/router';
import { UploadProductComponent } from './components/upload-product/upload-product.component';
import { ProductsComponent } from './components/products/products.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
  { path: 'login', component: AdminLoginComponent },
  { path: 'upload_product', component: UploadProductComponent, canActivate: [adminAuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [adminAuthGuard] },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' }
];
