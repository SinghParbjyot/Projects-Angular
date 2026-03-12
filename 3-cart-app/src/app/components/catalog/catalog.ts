import { Component, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';

import { SharingData } from '../../services/sharing-data.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'catalog',
   standalone : true,
  imports: [ProductCard],
  templateUrl: './catalog.html',
})
export class Catalog implements OnInit {
 products!: Product[];
  constructor( private productService: ProductService, private sharingDataService :SharingData){
  
  }
  onAddCart(product : Product){
    this.sharingDataService.productEventEmitter.emit(product);
  }
  ngOnInit(): void {
   
     this.products =  this.productService.findAll();
  
  }
}
