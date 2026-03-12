import { Component, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Catalog } from "../catalog/catalog";
import { Cart } from '../cart/cart';
import { CartItem } from '../../models/cartItem';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [Catalog, Cart, Navbar],
  templateUrl: './cart-app.html',
})
export class CartApp implements OnInit {
  products: Product[] = [];

  items: CartItem[] = [];

  total: number = 0;
  showCart: boolean = false;
  constructor(private service: ProductService) {
  }
  ngOnInit(): void {
    this.products = this.service.findAll();

    this.items = JSON.parse(sessionStorage.getItem('cart')!) || [];

    this.calculateTotal();
  }
  onAddCart(product: Product): void {
    const hasItem = this.items.find(item => {
      return item.product.id === product.id;
    });
    if (hasItem) {
      this.items = this.items.map(item => {
        if (item.product.id === product.id) {
          return {
            ...item, quantity: item.quantity + 1
          }
        } else {
          return item;
        }
      })
    } else {
      this.items = [... this.items, { product, quantity: 1 }];
    }
    this.calculateTotal();
    this.saveSession();

  }
  onDeleteCart(id: number): void {
    this.items = this.items.filter(item => item.product.id !== id);
    this.calculateTotal();
    this.saveSession();
  }
  calculateTotal(): void {
    this.total = this.items.reduce((accumulator, item) => accumulator + (item.quantity * item.product.price), 0);
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }
  setOpenCart(): void {
    this.showCart = !this.showCart;
  }

}
