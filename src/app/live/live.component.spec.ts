import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';

import { AppModule } from '../app.module';
import { LiveComponent } from './live.component';
import { RaceService } from '../race.service';
import { PonyWithPositionModel } from '../models/pony.model';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';

describe('LiveComponent', () => {

  const fakeRaceService = jasmine.createSpyObj('RaceService', ['get', 'live']);

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [
      { provide: RaceService, useValue: fakeRaceService }
    ]
  }));

  beforeEach(() => {
    fakeRaceService.get.calls.reset();
    fakeRaceService.live.calls.reset();
  });

  it('should initialize the array of positions with an empty array', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(of([]));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    expect(liveComponent.poniesWithPosition).toEqual([], 'poniesWithPosition should be initialized with an empty array');
  });

  it('should subscribe to the live observable if the race is PENDING', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(empty());

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(fakeRaceService.get).toHaveBeenCalledWith(1);
    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription).not.toBeNull('positionSubscription should store the subscription');
  }));

  it('should subscribe to the live observable if the race is RUNNING', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(of([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0 }
    ]));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(fakeRaceService.get).toHaveBeenCalledWith(1);
    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription).not.toBeNull('positionSubscription should store the subscription');
    expect(liveComponent.poniesWithPosition.length).toBe(1, 'poniesWithPositions should store the positions');
  }));

  it('should not subscribe to the live observable if the race is FINISHED', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'FINISHED',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(empty());

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(fakeRaceService.get).toHaveBeenCalledWith(1);
    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).not.toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription).not.toBeNull('positionSubscription should store the subscription');
  }));

  it('should change the race status once the race is RUNNING', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0 }
    ]);
    expect(liveComponent.poniesWithPosition.length).toBe(1, 'poniesWithPositions should store the positions');
    expect(liveComponent.raceModel.status).toBe('RUNNING', 'The race status should change to RUNNING once we receive positions');
  }));

  it('should switch the error flag if an error occurs', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.error(new Error('Oops'));
    expect(liveComponent.error).toBeTruthy('You should store that an error occurred in the `error` field');
  }));

  it('should unsubscribe on destruction', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    spyOn(liveComponent.positionSubscription, 'unsubscribe');

    liveComponent.ngOnDestroy();

    expect(liveComponent.positionSubscription.unsubscribe).toHaveBeenCalled();
  }));

  it('should tidy things up when the race is over', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 100 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 101 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 97 }
    ]);
    expect(liveComponent.poniesWithPosition.length).toBe(3, 'poniesWithPositions should store the positions');
    expect(liveComponent.winners).toBeUndefined('The winners should be undefined until the race is over');
    expect(liveComponent.betWon).toBeUndefined('The bet status should be undefined until the race is over');

    positions.complete();
    expect(liveComponent.raceModel.status).toBe('FINISHED', 'The race status should change to FINISHED once the race is over');
    expect(liveComponent.winners).not.toBeUndefined('The winners should be not undefined once the race is over');
    expect(liveComponent.winners.length).toBe(2, 'The winners should contain all the ponies that won the race');
    expect(liveComponent.winners.map(pony => pony.id)).toEqual([1, 2], 'The winners should contain all the ponies that won the race');
    expect(liveComponent.betWon).not.toBeUndefined('The bet status should not be undefined until the race is over');
    expect(liveComponent.betWon).toBeTruthy('The bet status should true if the player won the bet');
  }));

  it('should display the pending race', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h2');
    expect(title).not.toBeNull('The template should display an h2 element with the race name inside');
    expect(title.textContent).toContain('Lyon', 'The template should display an h2 element with the race name inside');
    const liveRace = element.querySelector('#live-race');
    expect(liveRace.textContent).toContain('The race will start');

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).not.toBeNull('You should display a `PonyComponent` for each pony');
    expect(ponyComponents.length).toBe(3, 'You should display a `PonyComponent` for each pony');

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).toBeFalsy('The ponies should not be running');
  });

  it('should display the running race', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h2');
    expect(title).not.toBeNull('The template should display an h2 element with the race name inside');
    expect(title.textContent).toContain('Lyon', 'The template should display an h2 element with the race name inside');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 10 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).not.toBeNull('You should display a `PonyComponent` for each pony');
    expect(ponyComponents.length).toBe(3, 'You should display a `PonyComponent` for each pony');

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).toBeTruthy('The ponies should be running');
  });

  it('should display the finished race', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot = { paramMap: convertToParamMap({ raceId: 1 }) };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h2');
    expect(title).not.toBeNull('The template should display an h2 element with the race name inside');
    expect(title.textContent).toContain('Lyon', 'The template should display an h2 element with the race name inside');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    positions.complete();
    fixture.detectChanges();

    // won the bet!
    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).not.toBeNull('You should display a `PonyComponent` for each winner');
    expect(ponyComponents.length).toBe(2, 'You should display a `PonyComponent` for each pony');

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).toBeFalsy('The ponies should be not running');

    expect(element.textContent).toContain('You won your bet!');

    // lost the bet...
    fixture.componentInstance.betWon = false;
    fixture.detectChanges();
    expect(element.textContent).toContain('You lost your bet.');

    // no winners (race was already over)
    fixture.componentInstance.winners = [];
    fixture.detectChanges();
    expect(element.textContent).toContain('The race is over.');

    // an error occurred
    fixture.componentInstance.error = true;
    fixture.detectChanges();
    const alert = element.querySelector('div.alert.alert-danger');
    expect(alert.textContent).toContain('A problem occurred during the live.');
  });
});
