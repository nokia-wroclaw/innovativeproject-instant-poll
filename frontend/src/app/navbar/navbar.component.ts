import {Component, Input, OnInit} from '@angular/core';
import {NavbarTitleService} from '../navbar-title.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;
  roomName;
  numberOfUsers = '0';

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  constructor(private navbarTitleService: NavbarTitleService) {
    this.navbarTitleService.roomName$.subscribe((roomName) => this.roomName = roomName);
    this.navbarTitleService.numberOfUsers$.subscribe((numberOfUsers) => this.numberOfUsers = numberOfUsers);
  }

  ngOnInit() {
  }

}
