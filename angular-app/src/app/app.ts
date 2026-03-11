import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Counter } from './counter/counter';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Counter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  //protected readonly title = signal('Hola mundo Angular desde componente!');
  title = 'Hola Mundo Angular';
  //protected readonly users = signal(['Pepe', 'Maria', 'Juan', 'Andrés']);
 users : string []  = ['Pepe', 'Maria', 'Juan', 'Andrés'];
 setTitle = 'Contador con estado de session';
  visible: boolean = false;
  counter !: number ;
   ngOnInit(): void {
    this.counter =  parseInt(sessionStorage.getItem("counter") || "0");
  }
  setVisible() : void{
    this.visible = this.visible ? false : true;
    console.log("Hemos hecho click en setVisible");
  }
  setCounter(counter : number) : void {
    this.counter = counter;
  }
 
}
 