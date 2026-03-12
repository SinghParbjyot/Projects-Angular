import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { Router, RouterOutlet } from '@angular/router';
import { SharingData } from '../../services/sharing-data.service';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './cart.html',
})
export class Cart {
  items: CartItem[] = [];

  total = 0;

  constructor(private sharingDataService : SharingData,private router : Router){
    this.items = this.router.getCurrentNavigation()?.extras.state!['items'];
        this.total = this.router.getCurrentNavigation()?.extras.state!['total'];

  }

  onDeleteCart(id: number) {
    //this.idProductEventEmitter.emit(id);
    this.sharingDataService.idProductEventEmitter.emit(id);
  }


}
