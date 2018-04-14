import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import * as Webstomp from 'webstomp-client';

import { ROUTES } from './app.routes';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';


import { JwtInterceptorService } from './jwt-interceptor.service';
import { WsService } from './ws.service';
import { LoggedInGuard } from './logged-in.guard';
import { UserService } from './user.service';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptorService, multi: true },
    { provide: WEBSOCKET, useFactory: () => WebSocket },
    { provide: WEBSTOMP, useFactory: () => Webstomp },
    JwtInterceptorService,
    WsService,
    LoggedInGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
