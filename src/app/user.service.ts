import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { UserModel } from './models/user.model';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userEvents = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpClient, private jwtInterceptorService: JwtInterceptorService, private wsService: WsService) {
    this.retrieveUser();
  }

  /**
   * register a new user in Ponyracer API
   * @param login string
   * @param password string
   * @param birthYear number
   * @returns Observable<UserModel>
   */
  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users`, body);
  }

  /**
   * authenticate a user with Ponyracer API
   * @param credentials object with 2 properties (login and password of a user)
   * @returns Observable<UserModel>
   */
  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users/authentication`, credentials).pipe(
      tap(user => this.storeLoggedInUser(user))
    );
  }

  /**
   * store the user logged in the PonyRacer API in localStorage
   * @param user the user logged in
   */
  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.jwtInterceptorService.setJwtToken(user.token);
    this.userEvents.next(user);
  }

  /**
   * retrieve the user stored in localStorage, emit userEvents with user retrieved, set token in JwtInterceptorService for authentification
   */
  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value);
      this.jwtInterceptorService.setJwtToken(user.token);
      this.userEvents.next(user);
    }
  }

  /**
   * emit empty userEvents, set token to null in JwtInterceptorService, empty localStorage
   */
  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
    this.jwtInterceptorService.removeJwtToken();
  }

  /**
   * abonnement aux updates du score du user loggedIn via le WebSocket
   * @param userId number which is the id of the loggedIn user
   */
  scoreUpdates(userId: number): Observable<UserModel> {
    return this.wsService.connect<UserModel>(`/player/${userId}`);
  }

  /**
   * test si un user est connecté
   */
  isLoggedIn(): boolean {
    return !!window.localStorage.getItem('rememberMe');
  }
}
