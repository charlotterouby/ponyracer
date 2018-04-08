import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { UserModel } from './models/user.model';
import { environment } from '../environments/environment';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { WsService } from './ws.service';

@Injectable()
export class UserService {

  userEvents: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpClient, private jwtService: JwtInterceptorService, private wsService: WsService) {
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
    const params = { login, password, birthYear };
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users`, params);
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
    this.userEvents.next(user);
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.jwtService.setJwtToken(user.token);
  }

  /**
   * retrieve the user stored in localStorage, emit userEvents with user retrieved, set token in JwtInterceptorService for authentification
   */
  retrieveUser() {
    const userRememberMe = window.localStorage.getItem('rememberMe');

    if (userRememberMe) {
      const user: UserModel = JSON.parse(userRememberMe);
      this.userEvents.next(user);
      this.jwtService.setJwtToken(user.token);
    }
  }

  /**
   * emit empty userEvents, set token to null in JwtInterceptorService, empty localStorage
   */
  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
    this.jwtService.removeJwtToken();
  }
  /**
   * abonnement aux updates du score du user loggedIn via le WebSocket
   * @param userId number which is the id of the loggedIn user
   */
  scoreUpdates(userId: number) {
    return this.wsService.connect(`/player/${userId}`);
  }

  /**
   * test si un user est connecté
   */
  isLoggedIn(): boolean {
    const userRememberMe = window.localStorage.getItem('rememberMe');
    return userRememberMe ? true : false;
  }

}
