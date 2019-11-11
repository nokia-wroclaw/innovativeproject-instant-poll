import { Component, OnInit } from '@angular/core';
import {TestingConnectionServiceService} from "../testing-connection-service.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  title: String = "";

  constructor(private service: TestingConnectionServiceService) {
  }

  ngOnInit() {
    this.service.testConnection().subscribe(data => {
      this.title = data['response'];
      console.log(data['response']);
    });
  }

}
