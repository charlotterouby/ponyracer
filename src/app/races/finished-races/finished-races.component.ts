import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RaceModel } from '../../models/race.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pr-finished-races',
  templateUrl: './finished-races.component.html',
  styleUrls: ['./finished-races.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinishedRacesComponent {

  races: Array<RaceModel>;
  page = 1;

  constructor(route: ActivatedRoute) {
    this.races = route.snapshot.data['races'];
  }

}
