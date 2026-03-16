import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SharingData {
  private _newUserEventEmitter : EventEmitter<User> = new EventEmitter();
  private _idUserEventEmitter: EventEmitter<number> = new EventEmitter();

  private _selectedUserEventEmitter: EventEmitter<User> = new EventEmitter();

  private _findUserByIdEventEmitter = new EventEmitter();
  constructor() { }

   get findUserByIdEventEmitter() : EventEmitter<number> {
    return this._findUserByIdEventEmitter;
  }

  get newUserEventEmitter() : EventEmitter<User> {
    return this._newUserEventEmitter;
  }
  get idUserEventEmitter() : EventEmitter<number> {
    return this._idUserEventEmitter;
  }
  get selectedUserEventEmitter() : EventEmitter<User> {
    return this._selectedUserEventEmitter;
  }


}
