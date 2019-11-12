import { Component, OnInit } from '@angular/core';
import { BackendConnectionService } from "../backend-connection.service";
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';

@Component({
	selector: 'app-pollroom',
	templateUrl: './pollroom.component.html',
	styleUrls: ['./pollroom.component.css']
})
export class PollroomComponent implements OnInit {

	constructor(private backendService: BackendConnectionService, private router: Router) { }

	ngOnInit() {
		if (localStorage.getItem("room_id") === null) {
			this.router.navigate(['/']);
		} else {
			this.backendService.checkUserRoom(localStorage.getItem("room_id")).subscribe(response => {
				if (!response['exists']) {
					this.router.navigate(['/']);
				}
			});
		}
	}

}
