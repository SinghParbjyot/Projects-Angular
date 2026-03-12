import { Component, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Catalog } from "../catalog/catalog";
import { Cart } from '../cart/cart';
import { CartItem } from '../../models/cartItem';
import { Navbar } from '../navbar/navbar';
import { Router, RouterOutlet } from '@angular/router';
import { SharingData } from '../../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [Catalog, Cart, Navbar, RouterOutlet],
  templateUrl: './cart-app.html',
})
export class CartApp implements OnInit {


  items: CartItem[] = [];

  total: number = 0;

  constructor(private sharingDataService: SharingData, private service: ProductService, private router: Router) {
  }
  ngOnInit(): void {

    this.items = JSON.parse(sessionStorage.getItem('cart')!) || [];

    this.calculateTotal();
    this.onDeleteCart();
    this.onAddCart();
  }
  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {
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
      this.router.navigate(['/cart'], {
        state: { items: this.items, total: this.total }

      });
      Swal.fire({
        title: "Shopping Cart?",
        text: "Nuevo producto agregado al carro",
        icon: "success"
      });
    })


  }
  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      console.log(id + " Se ha ejecutado un evento");
      Swal.fire({
        title: "Estas seguro que desea eliminar del carro de compras?",
        text: "Cuidado que se eliminara del carro de compras!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter(item => item.product.id !== id);
          if (this.items.length == 0) {
            sessionStorage.removeItem('cart');
            sessionStorage.clear();
          }
          this.calculateTotal();
          this.saveSession();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/cart'], { state: { items: this.items, total: this.total } });
          });
          Swal.fire({
            title: "Eliminado!",
            text: "EL producto se ha eliminado del carrito de compras",
            icon: "success"
          });
        }
      });
    })
  }

  calculateTotal(): void {
    this.total = this.items.reduce((accumulator, item) => accumulator + (item.quantity * item.product.price), 0);
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
