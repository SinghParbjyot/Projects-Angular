import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/cartItem';

@Component({
  selector: 'navbar',
  standalone : true,
  imports: [],
  templateUrl: './navbar.html',
})
export class Navbar {
  @Input() items: CartItem[] = [];
  @Output() openEventEmitter : EventEmitter<void> = new EventEmitter<void>();
  setOpenCart(){
    this.openEventEmitter.emit();
  }
}
