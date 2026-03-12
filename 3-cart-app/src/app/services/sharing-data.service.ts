import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class SharingData {
  
  private _idProductEventEmitter : EventEmitter<number>= new EventEmitter();
  constructor(){}

   private _productEventEmitter : EventEmitter<Product>= new EventEmitter();
  get idProductEventEmitter(): EventEmitter<number>{
    return this._idProductEventEmitter;
  }
  get productEventEmitter() : EventEmitter<Product>{
    return this._productEventEmitter
  }
}
