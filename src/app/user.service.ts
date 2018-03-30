import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  private _configUrl = 'http://ponyracer.ninja-squad.com';

  constructor(private http: HttpClient) { }

  register(login: string, password: string, birthYear: number) {
    const params = {login, password, birthYear};
    return this.http.post(`${this._configUrl}/api/users`, params );
  }

}
