import { Injectable } from '@angular/core';
import { InvoiceComponent } from '../components/invoice/invoice.component';
import { invoiceData } from '../data/invoice.data';
import { Invoice } from '../models/invoice';
import { Total } from '../components/total/total';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoice :Invoice = invoiceData;
  constructor(){}

  getInvoice() : Invoice{
    const total = this.calculateTotal();
    return {... this.invoice, total};
  }
  calculateTotal() : number{
   return this.invoice.items.reduce((accumulator,item) => accumulator +(item.price * item.quantity),0);
  }
  remove(id :number) : Invoice{
    this.invoice.items = this.invoice.items.filter(item => item.id != id);
    const total = this.calculateTotal();
    return{... this.invoice,total}
  }
  save(item: Item) : Invoice{
    this.invoice.items = [... this.invoice.items, item];
    const total = this.calculateTotal();
    return {... this.invoice,total};
  }
}
