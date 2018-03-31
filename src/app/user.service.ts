import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { UserModel } from './models/user.model';

@Injectable()
export class UserService {

  private _configUrl = 'http://ponyracer.ninja-squad.com';

  userEvents: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpClient) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const params = { login, password, birthYear };
    return this.http.post<UserModel>(`${this._configUrl}/api/users`, params);
  }

  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    return this.http.post<UserModel>(`${this._configUrl}/api/users/authentication`, credentials).pipe(
      tap(user => this.storeLoggedInUser(user))
    );
  }

  storeLoggedInUser(user: UserModel) {
    this.userEvents.next(user);
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
  }

  retrieveUser() {
    const userRememberMe = window.localStorage.getItem('rememberMe');

    if (userRememberMe) {
      const user: UserModel = JSON.parse(userRememberMe);
      this.userEvents.next(user);
    }
  }

}
