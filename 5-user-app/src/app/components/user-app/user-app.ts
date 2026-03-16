import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UserComponent } from "../user/usercomponent";
import { UserForm } from "../user-form/user-form";
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { SharingData } from '../../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './user-app.html',
  styleUrl: './user-app.component.css'
})
export class UserApp implements OnInit {

  users: User[] = [];
  

  constructor(private service: UserService, private sharingData: SharingData,private router : Router) {
    
  }
  ngOnInit(): void {
    this.service.findAll().subscribe(users1 => this.users = users1);
    this.addUser();
    this.removeUser();
    this.findById();
  }

  findById(){
    this.sharingData.findUserByIdEventEmitter.subscribe(id => {
      const user = this.users.find(user => user.id == id);

      this.sharingData.selectedUserEventEmitter.emit(user);
    })
  }
  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.users = this.users.map(u => (u.id == user.id) ? { ...user } : u);

      } else {
        this.users = [... this.users, { ...user, id: new Date().getTime() }];
      }
      this.router.navigate(['/users'],{state : {users : this.users}});
      Swal.fire({
        title: "Guardado!",
        text: "Usuario añadido con exito!",
        icon: "success"
      });
     
    });


  }
  removeUser(): void {
    this.sharingData.idUserEventEmitter.subscribe(id => {
      Swal.fire({
        title: "Estas seguro que quieres eliminar este usuario?",
        text: "Cuidado el usuario sera eliminado del sistema!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.users = this.users.filter(user => user.id != id);
          this.router.navigate(['/users/create'],{skipLocationChange: true}).then(() =>{
            this.router.navigate(['/users'],{state : {users : this.users}});
          })
          Swal.fire({
            title: "Eliminado con exito!",
            text: "Usuario eliminado del sistema",
            icon: "success"
          });
        }
      });

    })

  }
  
}
