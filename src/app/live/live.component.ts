import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  raceModel: RaceModel;
  positionSubscription: Subscription;
  poniesWithPosition: Array<PonyWithPositionModel> = [];

  constructor(private raceService: RaceService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id: string | number = this.route.snapshot.paramMap.get('raceId');
    if (id) {
      id = Number.parseInt(id);
      this.raceService.get(id).subscribe(data => this.raceModel = data);
      this.positionSubscription = this.raceService.live(id).subscribe(data => this.poniesWithPosition = data);
    }

  }
  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

}
