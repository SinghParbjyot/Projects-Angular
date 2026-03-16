import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Counter } from "./counter/counter";

@Component({
  selector: 'app-root',
  standalone : true,
  imports: [RouterOutlet, Counter],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('4-counter-app');
}
