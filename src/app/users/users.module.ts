import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { USERS_ROUTES } from './users.routes';

import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(USERS_ROUTES),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ]
})
export class UsersModule { }
