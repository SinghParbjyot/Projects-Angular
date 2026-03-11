import { Component, Input } from '@angular/core';
import { Client } from '../../models/client';
import { Address } from '../../models/address';

@Component({
  selector: 'client-view',
  standalone : true,
  imports: [],
  templateUrl: './client-view.html',
})
export class ClientView {
  @Input () client : Client = new Client();

}
