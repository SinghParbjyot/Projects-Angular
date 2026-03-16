import { Observable, of } from "rxjs";
import { User } from "../models/user";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root' 
})
export class UserService {
    private users: User[] = [
        {
            id: 1,
            name: "Andres",
            lastname: "Guzman",
            email: "andres@gmail.com",
            username: "andres",
            password: "123456"
        },
        {
            id: 2,
            name: "Maria",
            lastname: "Lopez",
            email: "maria.lopez@gmail.com",
            username: "mlopez",
            password: "password789"
        },
        {
            id: 3,
            name: "Carlos",
            lastname: "Perez",
            email: "carlos.perez@outlook.com",
            username: "cperez",
            password: "admin2024"
        },
        {
            id: 4,
            name: "Lucia",
            lastname: "Fernandez",
            email: "lucia.f@yahoo.com",
            username: "lufer",
            password: "securePass!"
        },
        {
            id: 5,
            name: "Javier",
            lastname: "Torres",
            email: "javi.torres@gmail.com",
            username: "jtorres",
            password: "qwerty123"
        }
    ];

    constructor(){}
    findAll() : Observable<User[]>{
        return of(this.users);
    }
}