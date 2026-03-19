import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { UserService } from '../../services/user.service';
import { SharingData } from '../../services/sharing-data.service';
import { Paginator } from '../paginator/paginator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterLink, Paginator],
  templateUrl: './user.html',
})
export class UserComponent implements OnInit {
  users: User[] = [];
  paginator: any = {};
  title: string = "Listado de Usuarios";
  constructor(private sharingData: SharingData, private router: Router, private service: UserService
    , private route: ActivatedRoute, private authService: AuthService) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];

    }
  }
  ngOnInit(): void {
    
    if (this.users == undefined || this.users == null || this.users.length == 0) {
      this.route.paramMap.subscribe(params => {
        const page: number = +(params.get('page') || '0');
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[];
          this.paginator = pageable;
          console.log(this.paginator+"desde component")
          console.log(this.users+"desde component")
          this.sharingData.pageUserFormEventEmitter.emit({ users: this.users, paginator: this.paginator });
        })
      }
      )
    }
  }


  onRemoveUser(id: number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }
  OnSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin(){
    return this.authService.isAdmin();
  }

}
