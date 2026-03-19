import { Component, Input } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'navbar',
  standalone : true,
  imports: [ RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  @Input() users : User[] = [];
  @Input() paginator = {};
  constructor(private authService : AuthService){}
  get login (){
    return this.authService.user
  }
  get admin() {
    return this.authService.isAdmin();
  }
}
