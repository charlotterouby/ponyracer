import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RACES_ROUTES } from './races.routes';

import { RaceService } from '../race.service';
import { RacesResolverService } from '../races-resolver.service';
import { RaceResolverService } from '../race-resolver.service';

import { RacesComponent } from './races.component';
import { RaceComponent } from '../race/race.component';
import { PonyComponent } from '../pony/pony.component';
import { BetComponent } from '../bet/bet.component';
import { LiveComponent } from '../live/live.component';
import { PendingRacesComponent } from './pending-races/pending-races.component';
import { FinishedRacesComponent } from './finished-races/finished-races.component';

import { FromNowPipe } from '../from-now.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RACES_ROUTES)
  ],
  declarations: [
    RacesComponent,
    RaceComponent,
    PonyComponent,
    BetComponent,
    LiveComponent,
    PendingRacesComponent,
    FinishedRacesComponent,
    FromNowPipe
  ],
  providers: [
    RaceService,
    RacesResolverService,
    RaceResolverService
  ]
})
export class RacesModule { }
