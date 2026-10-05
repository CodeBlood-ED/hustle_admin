import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductRequest } from '../../models/ProductRequest';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-upload-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './upload-product.component.html',
  styleUrl: './upload-product.component.css',
})
export class UploadProductComponent {
  private readonly productService = inject(ProductService);

  isUploading = signal<boolean>(false);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;

  readonly presetCategories = [
    { slug: 'iphone-13', label: 'iPhone 13' },
    { slug: 'iphone-14', label: 'iPhone 14' },
    { slug: 'iphone-15', label: 'iPhone 15' },
    { slug: 'iphone-16', label: 'iPhone 16' },
    { slug: 'iphone-12', label: 'iPhone 12' },
    { slug: 'iphone-11', label: 'iPhone 11' },
  ];

  uploadForm = new FormGroup({
    product_title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    product_category: new FormControl('iphone-13', [Validators.required]),
    product_mrp: new FormControl('999/-', [Validators.required]),
    product_netPrice: new FormControl('499/-', [Validators.required]),
    product_image: new FormControl('', [Validators.required]),
  });

  selectCategory(category: string): void {
    this.uploadForm.patchValue({ product_category: category });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set('Please select an image file (PNG, JPG, WEBP).');
        return;
      }

      this.selectedFile = file;
      this.errorMessage.set('');

      // Generate local thumbnail preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  handleSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.uploadForm.markAllAsTouched();
      if (!this.selectedFile) {
        this.errorMessage.set('Please choose a product image to upload.');
      }
      return;
    }

    this.isUploading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const formVal = this.uploadForm.value;
    const request: ProductRequest = {
      product_title: formVal.product_title?.trim(),
      product_category: formVal.product_category?.trim().toLowerCase(),
      product_mrp: formVal.product_mrp?.trim(),
      product_netPrice: formVal.product_netPrice?.trim(),
      product_image: this.selectedFile
    };

    this.productService.uploadProduct(request).subscribe({
      next: (res: any) => {
        this.isUploading.set(false);
        const title = request.product_title;
        this.successMessage.set(`Product "${title}" was successfully uploaded to Supabase PostgreSQL!`);
        this.resetForm();
      },
      error: (err: any) => {
        this.isUploading.set(false);
        const errorDetail = err?.error?.message || err?.message || 'Failed to upload product. Check backend connection and permissions.';
        this.errorMessage.set(errorDetail);
      }
    });
  }

  private resetForm(): void {
    this.uploadForm.reset({
      product_title: '',
      product_category: 'iphone-13',
      product_mrp: '999/-',
      product_netPrice: '499/-',
      product_image: ''
    });
    this.selectedFile = null;
    this.imagePreview.set(null);
  }
}
