import { Component, OnInit } from '@angular/core';
import { BackendConnectionService } from "../backend-connection.service";
import { Observable } from 'rxjs/internal/Observable';
import { Router, ActivatedRoute  } from '@angular/router';
import { Room } from '../room';

@Component({
	selector: 'app-pollroom',
	templateUrl: './pollroom.component.html',
	styleUrls: ['./pollroom.component.css']
})
export class PollroomComponent implements OnInit {
	
	private room : Room;

	constructor(private backendService: BackendConnectionService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {      
			this.backendService.getRoom(params['id']).subscribe(r => {
				this.room = r;
				document.getElementById("roomName").innerHTML = this.room.roomName;
			});
		});
	}
	
	closeRoom() {
		this.backendService.closeRoom(this.room.id);
		this.router.navigate(['rooms']);
	}
}
