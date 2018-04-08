import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as Webstomp from 'webstomp-client';

import { ROUTES } from './app.routes';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';

import { RaceService } from './race.service';
import { UserService } from './user.service';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { WsService } from './ws.service';
import { LoggedInGuard } from './logged-in.guard';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { RacesComponent } from './races/races.component';
import { RaceComponent } from './race/race.component';
import { PonyComponent } from './pony/pony.component';
import { LoginComponent } from './login/login.component';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';

import { FromNowPipe } from './from-now.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RacesComponent,
    RaceComponent,
    PonyComponent,
    FromNowPipe,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    BetComponent,
    LiveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    RaceService,
    UserService,
    JwtInterceptorService,
    { provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptorService, multi: true },
    WsService,
    { provide: WEBSOCKET, useFactory: () => WebSocket },
    { provide: WEBSTOMP, useFactory: () => Webstomp },
    LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
