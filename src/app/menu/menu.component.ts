import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { switchMap, concat, catchError } from 'rxjs/operators';

import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { empty } from 'rxjs/observable/empty';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  navbarCollapsed = true;

  user: UserModel | null = null;
  userEventsSubscription;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userEventsSubscription = this.userService.userEvents.pipe(
      switchMap((user: UserModel | null) => {
        if (user && user.id) {
          return of(user).pipe(
            concat(this.userService.scoreUpdates(user.id).pipe(
              catchError(() => empty())
            ))
          );
        }
        return of(null);
      })
    ).subscribe((user: UserModel | null) => this.user = user);
  }

  ngOnDestroy() {
    if (this.userEventsSubscription) {
      this.userEventsSubscription.unsubscribe();
    }

  }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(event) {
    event.preventDefault();
    event.stopPropagation();

    this.userService.logout();
    this.router.navigate(['/']);
  }

}
