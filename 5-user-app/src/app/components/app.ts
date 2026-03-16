import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserApp } from "./user-app/user-app";

@Component({
  selector: 'app-root',
  standalone : true,
  templateUrl: './app.html',
  imports: [UserApp],
})
export class App {
}
