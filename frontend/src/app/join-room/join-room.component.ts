import { Component, OnInit } from '@angular/core';
import { BackendConnectionService } from "../backend-connection.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Room } from '../room';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {

  private shortLink: string;
  private array: Array<Room>

  constructor(private backendService: BackendConnectionService, 
    private router: Router, 
    private route: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle( "Instant Polls - Dołącz do pokoju" );
    this.shortLink = "";
    this.route.params.subscribe(params => {
      if(params['shortLink'] !== undefined) {
        console.log("asd");
        this.backendService.getLongId(params['shortLink']).subscribe(response => {
          var roomId = response['roomId'];
          if(roomId !== null) {
            var storedRooms = JSON.parse(localStorage.getItem("latests"));
            if(!storedRooms.includes(roomId)) {
              storedRooms.push(roomId);
              localStorage.setItem("latests", JSON.stringify(storedRooms));
            }
            this.router.navigate(['/pollroom/', roomId]);
          } else {
            this.router.navigate(['/join']);
          }
        });
      }
      if (localStorage.getItem("latests") !== null) {
        this.backendService.checkUserRoom(localStorage.getItem("latests")).subscribe(response => {
          this.array = response;
          var rooms = [];
          for (var i in response) {
            rooms.push(response[i].id);
            if(rooms.length > 5) {
              rooms.shift();
            }
          }
          localStorage.setItem("latests", JSON.stringify(rooms));
        });
      } else {
        localStorage.setItem("latests", JSON.stringify([]));
      }
    });
  }

  joinRoom() {
    if(this.shortLink != "") {
        this.backendService.getLongId(this.shortLink).subscribe(response => {
          var roomId = response['roomId'];
          if(roomId !== null) {
            var storedRooms = Array.from(JSON.parse(localStorage.getItem("latests")));
            if(!storedRooms.includes(roomId)) {
              storedRooms.push(roomId);
              localStorage.setItem("latests", JSON.stringify(storedRooms));
            }
            this.router.navigate(['/pollroom/', roomId]);
          }
        });
      }
    }

}
