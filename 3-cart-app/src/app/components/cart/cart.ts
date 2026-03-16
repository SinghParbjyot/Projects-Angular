import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { Router, RouterOutlet } from '@angular/router';
import { SharingData } from '../../services/sharing-data.service';
import { ItemsState } from '../../store/items.reducer';
import { Store } from '@ngrx/store';
import { total } from '../../store/items.actions';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.html',
})
export class Cart  implements OnInit{
  items: CartItem[] = [];

  total = 0;

  constructor(private sharingDataService : SharingData,private router : Router, private store : Store<{items : ItemsState}>){
    this.store.select('items').subscribe(state => {
 this.items  = state.items ;
        this.total = state.total ;
    })


  }
  ngOnInit(): void {
    
  }

  onDeleteCart(id: number) {
    //this.idProductEventEmitter.emit(id);
    this.sharingDataService.idProductEventEmitter.emit(id);
  }


}
