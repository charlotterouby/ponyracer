import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RaceModel } from '../../models/race.model';

@Component({
  selector: 'pr-pending-races',
  templateUrl: './pending-races.component.html',
  styleUrls: ['./pending-races.component.css']
})
export class PendingRacesComponent implements OnInit {

  races: Array<RaceModel> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.races = data['races']);
  }

}
