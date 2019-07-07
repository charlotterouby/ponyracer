import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { JwtInterceptorService } from './jwt-interceptor.service';

@NgModule({
  declarations: [AppComponent, MenuComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),
    NgbAlertModule,
    NgbPaginationModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
