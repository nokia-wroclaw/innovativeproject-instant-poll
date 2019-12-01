import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarTitleService {
  private roomNameSource = new Subject<string>();

  roomName$ = this.roomNameSource.asObservable();

  setNavbarTitle( roomName: string ) {
    this.roomNameSource.next(roomName);
  }

  constructor() { }
}
