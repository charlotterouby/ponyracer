import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {

  private token: string | null = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // if there is a token add header to HTTP Request
    if (this.token) {
      // we need to add an OAUTH token as a header to access the Ponyracer API
      const clone = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      return next.handle(clone);
    }
    // if there is no token, we just handle it to the next handler
    return next.handle(req);
  }

  setJwtToken(token: string) {
    this.token = token;
  }

  removeJwtToken() {
    this.token = null;
  }

}
