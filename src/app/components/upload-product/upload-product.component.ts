import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ProductRequest } from '../../models/ProductRequest';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-upload-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './upload-product.component.html',
  styleUrl: './upload-product.component.css',
})
export class UploadProductComponent {
  product = new ProductRequest();
  constructor(private productService: ProductService) {}
  uploadForm = new FormGroup({
    product_title: new FormControl('', Validators.required),
    product_category: new FormControl('', Validators.required),
    product_mrp: new FormControl('', Validators.required),
    product_netPrice: new FormControl('', Validators.required),
    product_image: new FormControl('', Validators.required),
  });
  
  handleSubmit() {
    console.log(this.uploadForm.value);
    this.product = this.uploadForm.value as ProductRequest;
    this.productService.uploadProduct(this.product);
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if(file) {
      this.uploadForm.value.product_image = file;
    }
  }
}
