import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoiceComponent } from "./invoice/invoice.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InvoiceComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('2-invoice-app');
}
