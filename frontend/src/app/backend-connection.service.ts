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
		return this.http.post<Array<Room>>("/room/created", rooms, httpOptions);
	}

	public createRoom(name: string, date: string, token:string): Observable<Object> {
		var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if(token === null) {
            token = "";
        }
		var room = { "name": name, "date": date, "timeZone": timeZone, "token": token};
		return this.http.post("/room", JSON.stringify(room), httpOptions);
	}
	
	public getRoom(room_id: string) : Observable<Room> {
		return this.http.get<Room>("/room/"+room_id);
	}
	
	public closeRoom(room_id: string, token:string): Observable<Object> {
		if(token === null) {
            token = "";
        }
		const httpOptions2 = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': token
			})
		};
		return this.http.delete("/room/"+room_id, httpOptions2);
	}
    
    public generateUserId() {
        return this.http.get("/userID");
	}
	
	public redirectToRoom(shortId: string) {
		return this.http.get<string>("/"+shortId);
	}
}
