import { Routes } from '@angular/router';

import { LoggedInGuard } from './logged-in.guard';
import { RacesResolverService } from './races-resolver.service';
import { RaceResolverService } from './race-resolver.service';

import { HomeComponent } from './home/home.component';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';


export const ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'races',
    canActivate: [LoggedInGuard],
    loadChildren: './races/races.module#RacesModule'
  },
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  }
];
