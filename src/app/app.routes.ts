import { Routes } from '@angular/router';
import { UploadProductComponent } from './components/upload-product/upload-product.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
    {path:"", component: HomeComponent},
    {path:"upload_product", component: UploadProductComponent},
    {path: "products", component: ProductsComponent}
];
