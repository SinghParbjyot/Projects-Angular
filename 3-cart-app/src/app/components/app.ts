import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartApp } from './cart-app/cart-app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CartApp],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('3-cart-app');
}
