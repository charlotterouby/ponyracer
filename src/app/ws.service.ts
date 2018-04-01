import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';

@Injectable()
export class WsService {

  constructor(@Inject(WEBSOCKET) private WebSocket, @Inject(WEBSTOMP) private Webstomp) {}
  /**
   * permet de souscrire à un channel Stomp, et retourne un Observable<any>
   */
  connect(channel): Observable<any> {
    return Observable.create(observer => {
      // create the WebSocket connection
      const connection = new WebSocket(`${environment.wsBaseUrl}/ws`);
      // create the stomp client with Webstomp
      const stompClient = this.Webstomp.over(connection);
      // connect the stomp client
      let subscription;
      stompClient.connect({ login: null, passcode: null }, () => {
        // subscribe to the specific channel
        subscription = stompClient.subscribe(channel, message => {
          // emit the message received, after extracting the JSON from the body
          const bodyAsJson = JSON.parse(message.body);
          observer.next(bodyAsJson);
        });
      }, error => {
        // propagate the error
        observer.error(error);
      });
      // handle the unsubscription
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        connection.close();
      };
    });
  }

}
