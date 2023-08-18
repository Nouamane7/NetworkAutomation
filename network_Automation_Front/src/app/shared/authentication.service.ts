import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private localStorage: LocalStorageService, private http: HttpClient) { }

  authenticate(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>('http://localhost:8000/api/authenticate/', { username, password }).pipe(map(data => {
      if(data)  this.localStorage.store('username', username);
      return data;
    }))
  }
  
}

