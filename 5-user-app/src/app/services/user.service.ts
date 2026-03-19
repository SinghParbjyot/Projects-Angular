import { Observable } from "rxjs";
import { User } from "../models/user";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root' 
})
export class UserService {
    private users: User[] = [];
    private url : string = 'http://localhost:8080/api/users';
    constructor( private httpClient : HttpClient){}
    findAll() : Observable<User[]>{
        //return of(this.users);
        return this.httpClient.get<User[]>(this.url);
    }

    findById(id : number): Observable<User>{
        return this.httpClient.get<User>(`${this.url}/${id}`);
    }
    create(user : User) : Observable<User>{
        return this.httpClient.post<User>(this.url, user);
    }
    update(user : User): Observable<User>{
        return this.httpClient.put<User>(`${this.url}/${user.id}`,user);
    }
    delete(id : number): Observable<void>{
        return this.httpClient.delete<void>(`${this.url}/${id}`);
    }
    findAllPageable(page : number) : Observable<any>{
        //return of(this.users);
        return this.httpClient.get<any>(`${this.url}/page/${page}`);
    }

}