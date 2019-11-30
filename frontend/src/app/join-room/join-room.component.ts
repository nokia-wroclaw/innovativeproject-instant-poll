import { Component, OnInit } from '@angular/core';
import { BackendConnectionService } from "../backend-connection.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {

  private shortLink: string;

  constructor(private backendService: BackendConnectionService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.shortLink = "";
    this.route.params.subscribe(params => {
      if(params['shortLink'] !== undefined) {
        this.backendService.getLongId(params['shortLink']).subscribe(response => {
          var roomId = response['roomId'];
          if(roomId !== null) {
            this.router.navigate(['/pollroom/', roomId]);
          } else {
            this.router.navigate(['/join']);
          }
        });
      }
    });
  }

  joinRoom() {
    if(this.shortLink != "") {
        this.backendService.getLongId(this.shortLink).subscribe(response => {
          var roomId = response['roomId'];
          if(roomId !== null) {
            this.router.navigate(['/pollroom/', roomId]);
          }
        });
      }
    }

}
