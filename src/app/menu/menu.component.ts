import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, concat, of, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  navbarCollapsed = true;

  user: UserModel;
  userEventsSubscription: Subscription;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.userEventsSubscription = this.userService.userEvents.pipe(
      switchMap(user => user ?
        concat(of(user), this.userService.scoreUpdates(user.id).pipe(catchError(() => EMPTY))) :
        of(null)
      ))
      .subscribe(userWithScore => this.user = userWithScore);
  }

  ngOnDestroy() {
    if (this.userEventsSubscription) {
      this.userEventsSubscription.unsubscribe();
    }
  }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(event: Event) {
    event.preventDefault();
    this.userService.logout();
    this.router.navigate(['/']);
  }

}
