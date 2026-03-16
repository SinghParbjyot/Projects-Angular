import { Component, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';

import { SharingData } from '../../services/sharing-data.service';
import { ProductService } from '../../services/product.service';
import { Store } from '@ngrx/store';
import { load } from '../../store/products.actions';
import { products } from '../../data/product.data';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './catalog.html',
})
export class Catalog implements OnInit {
  products!: Product[];
  constructor(private store: Store<{ products: any }>, private productService: ProductService, private sharingDataService: SharingData) {
    this.store.select('products').subscribe(state => this.products = state.products)
  }
  onAddCart(product: Product) {
    this.sharingDataService.productEventEmitter.emit(product);
  }
  ngOnInit(): void {

    this.store.dispatch(load());


  }
}
