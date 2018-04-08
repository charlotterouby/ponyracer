import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/observable/interval';
import { empty } from 'rxjs/observable/empty';
import { bufferToggle, catchError, filter, groupBy, map, mergeMap, switchMap, throttleTime } from 'rxjs/operators';

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
  winners: Array<PonyWithPositionModel> = [];
  betWon: boolean;
  clickSubject = new Subject<PonyWithPositionModel>();

  constructor(private raceService: RaceService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.raceModel = this.route.snapshot.data['race'];

    if (this.raceModel.status !== 'FINISHED') {
      this.positionSubscription = this.raceService.live(this.raceModel.id)
        .subscribe(
          listOfPonies => {
            this.raceModel.status = 'RUNNING';
            this.poniesWithPosition = listOfPonies;
          },
          error => this.error = true,
          () => {
            this.raceModel.status = 'FINISHED';
            this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
            this.betWon = this.winners.some(pony => pony.id === this.raceModel.betPonyId);
          }
        );
    }

    this.clickSubject.pipe(
      groupBy(pony => pony.id, pony => pony.id),
      mergeMap(obs => obs.pipe(
        bufferToggle(obs, () => interval(1000))
      )),
      filter(array => array.length >= 5),
      throttleTime(1000),
      map(array => array[0]),
      switchMap(ponyId => this.raceService.boost(this.raceModel.id, ponyId).pipe(
        catchError(() => empty())
      ))
    ).subscribe(() => { });
  }

  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

  onClick(pony: PonyWithPositionModel) {
    this.clickSubject.next(pony);
  }

  ponyById(index: number, pony: PonyWithPositionModel): number {
    return pony.id;
  }

}
