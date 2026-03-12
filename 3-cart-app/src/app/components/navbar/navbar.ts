import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { RouterModule } from '@angular/router';
import { Catalog } from '../catalog/catalog';
import { Product } from '../../models/product';


@Component({
  selector: 'navbar',
  standalone : true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
})
export class Navbar {
@Input() items: CartItem[] = [];
@Input() total: number = 0;


}
