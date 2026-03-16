import { Component, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Catalog } from "../catalog/catalog";
import { Cart } from '../cart/cart';
import { CartItem } from '../../models/cartItem';
import { Navbar } from '../navbar/navbar';
import { Router, RouterOutlet } from '@angular/router';
import { SharingData } from '../../services/sharing-data.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { add, remove, total } from '../../store/items.actions';
import { ItemsState } from '../../store/items.reducer';

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [ Navbar, RouterOutlet],
  templateUrl: './cart-app.html',
})
export class CartApp implements OnInit {


  items: CartItem[] = [];


  constructor(
    private store: Store<{ items: ItemsState }>, private sharingDataService: SharingData,
    private service: ProductService, private router: Router) {
    this.store.select('items').subscribe(state => {
      this.items = state.items;
      this.saveSession();
    });

  }
  ngOnInit(): void {
    this.store.dispatch(total());
    this.onDeleteCart();
    this.onAddCart();
  }
  // Metodo para añadir al carro
  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {

      this.store.dispatch(add({ product }));
      this.store.dispatch(total());


      this.router.navigate(['/cart'], {
        state: { items: this.items }

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

          this.store.dispatch(remove({ id: id }));
          this.store.dispatch(total());

          
            this.router.navigate(['/cart']);
          Swal.fire({
            title: "Eliminado!",
            text: "EL producto se ha eliminado del carrito de compras",
            icon: "success"
          });
        }
      });
    })
  }

  

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
