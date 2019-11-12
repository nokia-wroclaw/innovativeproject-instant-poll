import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

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

	private baseURL: string;

	constructor(private http: HttpClient) {
		this.baseURL = 'http://localhost:8080';
	}

	public checkUserRoom(id: string): Observable<Object> {
		var room_id = { "room_id": id };
		return this.http.post(this.baseURL + "/checkUserRoom", JSON.stringify(room_id), httpOptions);
	}
	public createRoom(): Observable<Object> {
		return this.http.get(this.baseURL + "/createRoom");
	}
}
