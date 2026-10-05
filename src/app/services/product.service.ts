import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductRequest } from '../models/ProductRequest';
import { ProductResponse } from '../models/ProductResponse';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  readonly apiUrl = environment.apiUrl;
  readonly imageBaseUrl = environment.imageBaseUrl;

  // service method for uploading product request as form data
  uploadProduct(product: ProductRequest): Observable<any> {
    const url = `${this.apiUrl}/upload_product`;

    const formData = new FormData();
    formData.append("product_title", product.product_title ?? '');
    formData.append("product_category", product.product_category ?? '');
    formData.append("product_mrp", product.product_mrp ?? '');
    formData.append("product_netPrice", product.product_netPrice ?? '');
    if (product.product_image) {
      formData.append("product_image", product.product_image, product.product_image.name);
    }

    return this.http.post(url, formData);
  }

  // service method to retrieve saved products from DB
  retrieveProducts(): Observable<ProductResponse[]> {
    const url = `${this.apiUrl}/get_products`;
    return this.http.get<ProductResponse[]>(url);
  }

  // Helper to format image URLs
  formatImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'assets/placeholder.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/api/v1/')) {
      return `${this.imageBaseUrl}${imageUrl}`;
    }
    return imageUrl;
  }
}
