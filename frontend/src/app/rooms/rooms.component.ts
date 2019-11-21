import { Component, OnInit } from '@angular/core';
import { BackendConnectionService } from "../backend-connection.service";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Room } from '../room';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  
	private array : Array<Room>;
  
	constructor(private backendService: BackendConnectionService, private router: Router) { }

  ngOnInit() {
	  
	(<HTMLInputElement>document.getElementById("date")).value = new Date().toJSON().slice(0,10).replace(/-/g,'.').toString();
	
	if (localStorage.getItem("rooms") !== null) {
		this.backendService.checkUserRoom(localStorage.getItem("rooms")).subscribe(response => {
			this.array = response;
		});
	} else {
		localStorage.setItem("rooms",  JSON.stringify([]));
	}
  }
  
  createRoom() {
	var name = (<HTMLInputElement>document.getElementById("roomName")).value;
	var date = (<HTMLInputElement>document.getElementById("date")).value;
	var token = localStorage.getItem("token");
	this.backendService.createRoom(name,date,token).subscribe(response => {
		var storedRooms = JSON.parse(localStorage.getItem("rooms"));
		var id = response['room_id'];
		var tokenNew = response['token'];
		storedRooms.push(id);
		localStorage.setItem("rooms",  JSON.stringify(storedRooms));
		localStorage.setItem("token",  tokenNew);
		this.enterRoom(id);
	  });
  }
  
  enterRoom(id: string) {
	  this.router.navigate(['/pollroom/',id]);
  }

  deleteRoom(id: string) {
	var token = localStorage.getItem("token");
	this.backendService.closeRoom(id,token).subscribe(response => {
		if(response['result'] === 'success') {
			this.array = this.array.filter(x => x.id !== id)
		}
	});
	
}
}
