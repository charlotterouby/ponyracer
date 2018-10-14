import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concat, of, EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, shareReplay } from 'rxjs/operators';

import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  navbarCollapsed = true;

  userEvents: Observable<UserModel>;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userEvents = this.userService.userEvents.pipe(
      switchMap(
        (user) =>
          user ? concat(of(user), this.userService.scoreUpdates(user.id).pipe(catchError(() => EMPTY))) : of(null)
      ),
      shareReplay(1)
    );
  }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(event: Event) {
    event.preventDefault();
    this.userService.logout();
    this.router.navigate([ '/' ]);
  }
}
