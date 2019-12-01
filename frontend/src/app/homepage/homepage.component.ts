import { Component, OnInit } from '@angular/core';
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

  constructor(private backendService: BackendConnectionService, private router: Router, private titleService: Title) {
  }

  ngOnInit() {
      this.titleService.setTitle( "Instant Polls - Strona główna" );
  }
}
