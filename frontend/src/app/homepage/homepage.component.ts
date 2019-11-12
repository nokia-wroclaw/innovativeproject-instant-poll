import { Component, OnInit } from '@angular/core';
import { TestingConnectionServiceService } from "../testing-connection-service.service";
import { BackendConnectionService } from "../backend-connection.service";
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  title: String = "";

  constructor(private service: TestingConnectionServiceService, private backendService: BackendConnectionService, private router: Router) {
  }

  ngOnInit() {
    this.service.testConnection().subscribe(data => {
      this.title = data['response'];
    });
    if (localStorage.getItem("room_id") !== null) {
      this.backendService.checkUserRoom(localStorage.getItem("room_id")).subscribe(response => {
        if (response['exists']) {
          this.router.navigate(['/pollroom']);
        }
      });
    }
  }

  createRoom() {
    this.backendService.createRoom().subscribe(response => {
      localStorage.setItem("room_id", response['room_id']);
      this.router.navigate(['/pollroom']);
    });
  }
}
