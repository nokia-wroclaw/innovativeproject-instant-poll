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
    if (localStorage.getItem("latests") !== null) {
      this.backendService.checkUserRoom(localStorage.getItem("latests")).subscribe(response => {
        this.array = response.reverse();
        var rooms = [];
        for (var i in response) {
          rooms.push(response[i].id)
        }
        localStorage.setItem("latests", JSON.stringify(rooms));
      });
    } 
  }

  joinRoom() {
    if(this.shortLink != "") {
      this.route.params.subscribe(params => {
        const regex = new RegExp("/#/join", "i");
        window.location.href = window.location.href.replace(regex,"/j/"+this.shortLink);
      });
    }
  }

}
