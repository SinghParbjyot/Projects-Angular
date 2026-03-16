import { Component, Input } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'navbar',
  standalone : true,
  imports: [ RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  @Input() users : User[] = [];
}
