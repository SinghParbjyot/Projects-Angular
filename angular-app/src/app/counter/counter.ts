import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.html',
})
export class Counter implements OnInit {
  counter: number = 0;

 @Input() title! : string;

 @Output() counterEmmit: EventEmitter<number> = new EventEmitter();
  ngOnInit(): void {
    this.counter =  parseInt(sessionStorage.getItem("counter") || "0");
    console.log("Creando Componente");
  }
  

  setCounter(): void {
    this.counter++;
    sessionStorage.setItem("counter", this.counter.toString());
    this.counterEmmit.emit( this.counter);
  }
}
