import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../models/ProductResponse';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products = new Array<ProductResponse>();
  constructor(private productService: ProductService){}

  ngOnInit() {
    this.productService.retrieveProducts().subscribe((data)=> {
      this.products = data;
    })
  }
}
