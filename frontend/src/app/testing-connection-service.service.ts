import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class TestingConnectionServiceService {

  private baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = 'http://localhost:8080';
  }

  public testConnection(): Observable<String> {
    return this.http.get<String>(this.baseURL + "/test");
  }
}
