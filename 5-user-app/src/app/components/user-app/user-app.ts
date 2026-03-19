import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { SharingData } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './user-app.html'
})
export class UserApp implements OnInit {

  users: User[] = [];
  paginator: any = {};

  constructor(private service: UserService, private sharingData: SharingData, private router: Router,
    private route: ActivatedRoute, private authService: AuthService) {

  }
  ngOnInit(): void {

    this.addUser();
    this.removeUser();
    this.findById();
    this.pageUsersEvent();
    this.handlerLogin();
  }
  handlerLogin() {
    this.sharingData.handlerLoginEventEmiter.subscribe(({ username, password }) => {
      console.log(username + " " + password);
      this.authService.loginUser({ username, password }).subscribe({
        next: response => {
          const token = response.token;
          console.log(token);
          const payload = this.authService.getPayload(token);

          const user = { username: payload.sub };
          const login = { user, isAuth: true, isAdmin: payload.isAdmin }
          this.authService.token = token;
          this.authService.user = login;
          this.router.navigate(['/users/page/0'])
        },
        error: error => {
          if (error.status == 401) {
            Swal.fire(
              'Error en el Login', error.error.message, 'error'
            )
          } else {
            throw error;
          }
        }
      })
    })
  }

  findById() {
    this.sharingData.findUserByIdEventEmitter.subscribe(id => {
      this.service.findById(id).subscribe(user => {
        this.sharingData.selectedUserEventEmitter.emit(user);
      });
    });
  }
  pageUsersEvent(): void {
    this.sharingData.pageUserFormEventEmitter.subscribe(pageable => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;

    });

  }
  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.service.update(user).subscribe({
          next: (userUpdated) => {
            this.users = this.users.map(u => (u.id == userUpdated.id) ? { ...userUpdated } : u);
            this.router.navigate(['/users'], { state: { users: this.users, paginator: this.paginator } });
            Swal.fire({
              title: "Actualizado!",
              text: "Usuario actualizado con exito!",
              icon: "success"
            });
          }, error: (err) => {
            //console.log(err.error)
            console.log(err.status);

            if (err.status == 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }

          }
        })
      } else {


        this.service.create(user).subscribe({
          next: userNew => {
            console.log(userNew);
            this.users = [... this.users, { ...userNew }];
            this.router.navigate(['/users'], { state: { users: this.users, paginator: this.paginator } });
            Swal.fire({
              title: "Creado nuevo usuario!",
              text: "Usuario añadido con exito!",
              icon: "success"
            });
          }, error: (err) => {
            //console.log(err.error)

            if (err.status == 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }

          }
        });
      }

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
          this.service.delete(id).subscribe(() => {
            this.users = this.users.filter(user => user.id != id);
            this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
              this.router.navigate(['/users'], { state: { users: this.users, paginator: this.paginator } });
            })
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
