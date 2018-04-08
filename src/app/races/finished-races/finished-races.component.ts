import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RaceModel } from '../../models/race.model';

@Component({
  selector: 'pr-finished-races',
  templateUrl: './finished-races.component.html',
  styleUrls: ['./finished-races.component.css']
})
export class FinishedRacesComponent implements OnInit {

  races: Array<RaceModel> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.races = data['races']);
  }

}
