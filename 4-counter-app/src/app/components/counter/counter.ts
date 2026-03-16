import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { decrement, increment, reset } from '../../store/items.action';

@Component({
  selector: 'counter',
  standalone : true,
  imports: [],
  templateUrl: './counter.html',
})
export class Counter {
  title : string = 'Counter Component';
  counter : number = 0;
  constructor( private store : Store<{counter : number}>){
   this.store.select('counter').subscribe( counterEmit => {
    this.counter = counterEmit;
   });
  }

  increment() : void{
    //this.counter++;
    this.store.dispatch(increment({add: 3}));
    console.log("Incrementando");
  }
   decrement() : void{
    //this.counter--;
        this.store.dispatch(decrement());

    console.log("Decrementando");
  }
   reset() : void{
    //this.counter = 0;
    this.store.dispatch(reset());
    console.log("reset");
  }
}
