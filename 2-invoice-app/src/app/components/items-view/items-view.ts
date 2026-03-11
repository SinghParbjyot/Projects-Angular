import { Component, Input } from '@angular/core';
import { Item } from '../../models/item';
import { RowItem } from "../row-item/row-item";

@Component({
  selector: 'items-view',
    standalone : true,
  imports: [RowItem],
  templateUrl: './items-view.html',
})
export class ItemsView {
  @Input() items: Item[] = [];
}
