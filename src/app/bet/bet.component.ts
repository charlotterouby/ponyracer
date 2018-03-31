import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';
import { RaceService } from '../race.service';

@Component({
  selector: 'pr-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {

  raceModel: RaceModel;
  betFailed = false;

  constructor(private route: ActivatedRoute, private raceService: RaceService) { }

  ngOnInit() {
    let id: string | number = this.route.snapshot.paramMap.get('raceId');
    if (id) {
      id = Number.parseInt(id);
      this.raceService.get(id).subscribe(data => this.raceModel = data);
    }
  }

  betOnPony(pony) {
    if (!this.isPonySelected(pony)) {
      this.raceService.bet(this.raceModel.id, pony.id).subscribe(
        data => this.raceModel = data,
        error => this.betFailed = true
      );
    } else {
      this.raceService.cancelBet(this.raceModel.id).subscribe(
        () => this.raceModel.betPonyId = null,
        error => this.betFailed = true
      );
    }
  }

  isPonySelected(pony: PonyModel) {
    if (this.raceModel.betPonyId) {
      return pony.id === this.raceModel.betPonyId;
    }
    return false;
  }

}
