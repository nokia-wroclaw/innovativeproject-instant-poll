import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarTitleService {
  private roomNameSource = new Subject<string>();
  private numberOfUsersSource = new Subject<string>();

  roomName$ = this.roomNameSource.asObservable(); //style: naming Observable variables with $ 
  numberOfUsers$ = this.numberOfUsersSource.asObservable();

  setNavbarTitle( roomName: string ) {
    this.roomNameSource.next(roomName); //observable.next() === send new value to all subscribers 
  }

  setNavbarNumberOfUsers( numberOfUsers : string) {
    this.numberOfUsersSource.next(numberOfUsers);
  } 

  constructor() {}
}
