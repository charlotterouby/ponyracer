import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { WsService } from './ws.service';
import { RaceModel, LiveRaceModel } from './models/race.model';
import { PonyWithPositionModel } from './models/pony.model';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor(private http: HttpClient, private wsService: WsService) { }

  /**
   * get the list of the pending races
   * @param status string : le statut de la course 'PENDING' ou 'FINISHED'
   * @returns Observable<Array<RaceModel>>
   */
  list(status: string): Observable<Array<RaceModel>> {
    const params = { status };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
  }

  /**
   * Betting on a pony in a race
   * @param raceId number which is the id of the race
   * @param ponyId number which is the id of the pony on which the bet is placed
   * @returns Observable<RaceModel>
   */
  bet(raceId: number, ponyId: number): Observable<RaceModel> {
    return this.http.post<RaceModel>(`${environment.baseUrl}/api/races/${raceId}/bets`, { ponyId });
  }

  /**
   * allowing to get the detail of a race by its ID
   * @param id number which is the id of the race
   * @returns Observable<RaceModel>
   */
  get(raceId: number): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${raceId}`);
  }

  /**
   * cancel the bet on a race
   * @param raceId number which is the id of the race
   * @returns Observable without response if success
   */
  cancelBet(raceId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }

  /**
   * get the list of ponies running in the race with their current position
   * @param raceId number wich is the id of the race
   */
  live(raceId: number): Observable<Array<PonyWithPositionModel>> {
    return this.wsService.connect<LiveRaceModel>(`/race/${raceId}`).pipe(
      takeWhile(liveRace => liveRace.status !== 'FINISHED'),
      map(liveRace => liveRace.ponies)
    );
  }

  /**
   * boost a pony by increasing its speed while running
   * @param raceId number wich is the id of the race
   * @param ponyId number wich is the id of the pony boosted
   */
  boost(raceId: number, ponyId: number) {
    return this.http.post(`${environment.baseUrl}/api/races/${raceId}/boosts`, { ponyId });
  }

}
