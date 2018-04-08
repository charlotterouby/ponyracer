import { LoggedInGuard } from './logged-in.guard';
import { RacesResolverService } from './races-resolver.service';
import { RaceResolverService } from './race-resolver.service';

import { HomeComponent } from './home/home.component';
import { RacesComponent } from './races/races.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';
import { PendingRacesComponent } from './races/pending-races/pending-races.component';
import { FinishedRacesComponent } from './races/finished-races/finished-races.component';

export const ROUTES: Array<object> = [
    { path: '', component: HomeComponent },
    {
        path: 'races',
        children: [
            {
                path: '',
                component: RacesComponent,
                children: [
                    { path: '', pathMatch: 'full', redirectTo: 'pending' },
                    {
                        path: 'pending',
                        component: PendingRacesComponent,
                        resolve: {
                            races: RacesResolverService
                        }
                    },
                    {
                        path: 'finished',
                        component: FinishedRacesComponent,
                        resolve: {
                            races: RacesResolverService
                        }
                    }
                ]
            },
            {
                path: ':raceId',
                component: BetComponent,
                resolve: {
                    race: RaceResolverService
                }
            },
            {
                path: ':raceId/live',
                component: LiveComponent,
                resolve: {
                    race: RaceResolverService
                }
            },
        ],
        canActivate: [LoggedInGuard]
    },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent }
];
