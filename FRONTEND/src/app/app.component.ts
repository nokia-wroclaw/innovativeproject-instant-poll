import { Component, OnInit } from '@angular/core';
import { TestingConnectionServiceService } from '../app/testing-connection-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
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
