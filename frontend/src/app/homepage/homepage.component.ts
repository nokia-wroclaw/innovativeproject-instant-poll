import { Component, OnInit } from '@angular/core';
import { TestingConnectionServiceService } from "../testing-connection-service.service";
import { BackendConnectionService } from "../backend-connection.service";
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  title: String = "";

  constructor(private service: TestingConnectionServiceService, private backendService: BackendConnectionService, private router: Router, private titleService: Title) {
  }

  ngOnInit() {
      this.titleService.setTitle( "Instatnt Polls - Strona główna" );
    this.service.testConnection().subscribe(data => {
      console.log(data['response']);
    });
  }
}
