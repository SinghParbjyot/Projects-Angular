import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'paginator',
  standalone : true,
  imports: [RouterModule],
  templateUrl: './paginator.html',
})
export class Paginator {

  @Input() url !: string;
 
  @Input() paginator : any = {};
}
