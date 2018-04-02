import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { tap, filter, switchMap } from 'rxjs/operators';

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
  error = false;
  winners: Array<PonyWithPositionModel>;
  betWon: boolean;

  constructor(private raceService: RaceService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id: string | number = this.route.snapshot.paramMap.get('raceId');
    if (id) {
      id = Number.parseInt(id);
      this.positionSubscription = this.raceService.get(id).pipe(
        tap(race => this.raceModel = race),
        filter(race => race.status !== 'FINISHED'),
        switchMap(() => this.raceService.live(id))
      ).subscribe(
        listOfPonies => {
          this.raceModel.status = 'RUNNING';
          this.poniesWithPosition = listOfPonies;
        },
        error => this.error = true,
        () => {
          this.raceModel.status = 'FINISHED';
          this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
          this.betWon = false;
          for (let i = 0; i < this.winners.length; i++) {
            const pony = this.winners[i];
            if (pony.id === this.raceModel.betPonyId) {
              this.betWon = true;
              break;
            }
          }
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

}
