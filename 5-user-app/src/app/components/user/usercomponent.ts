import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { UserService } from '../../services/user.service';
import { SharingData } from '../../services/sharing-data.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user.html',
})
export class UserComponent {
  users: User[] = [];

  title: string = "Listado de Usuarios";
  constructor(private sharingData: SharingData, private router: Router, private service: UserService) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    } else {
      this.service.findAll().subscribe(users1 => this.users = users1);
    }

  }
  onRemoveUser(id: number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }
  
}
