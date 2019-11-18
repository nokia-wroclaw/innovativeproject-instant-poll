import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Room } from './room';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': 'my-auth-token'
	})
};

@Injectable({
	providedIn: 'root'
})
export class BackendConnectionService {

	constructor(private http: HttpClient) {
	}

	public checkUserRoom(rooms: string): Observable<Room[]> {
		return this.http.post<Array<Room>>("/room/check", rooms, httpOptions);
	}
	public createRoom(name: string, date: string): Observable<Object> {
		var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		var room = { "name": name, "date": date, "timeZone": timeZone};
		return this.http.post("/room/create", JSON.stringify(room), httpOptions);
	}
	public getRoom(room_id: string) : Observable<Room> {
		return this.http.get<Room>("/room/"+room_id);
	}
	
	public closeRoom(room_id: string) {
		var room = { "room_id": room_id };
		console.log(room);
		const post = this.http.post("/room/close",JSON.stringify(room),httpOptions);
		post.subscribe();
	}
}
