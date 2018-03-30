import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  private _configUrl = 'http://ponyracer.ninja-squad.com';

  constructor(private http: HttpClient) { }

  register(login: string, password: string, birthYear: number): Observable<Object> {
    const params = {login, password, birthYear};
    return this.http.post<Object>(`${this._configUrl}/api/users`, params );
  }

  authenticate(credentials: {login: string; password: string}): Observable<Object> {
    return this.http.post<Object>(`${this._configUrl}/api/users/authentication`, credentials);
  }

}
