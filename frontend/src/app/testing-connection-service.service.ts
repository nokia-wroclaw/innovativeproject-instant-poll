import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class TestingConnectionServiceService {

  constructor(private http: HttpClient) {
  }

  public testConnection(): Observable<String> {
    return this.http.get<String>("/test");
  }
}
