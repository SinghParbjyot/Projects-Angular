import { Component, Input } from '@angular/core';
import { Item } from '../../models/item';

@Component({
  selector: 'tr[row-item]',
    standalone : true,
  imports: [],
  templateUrl: './row-item.html',
})
export class RowItem {
  @Input() item!: Item;
}
