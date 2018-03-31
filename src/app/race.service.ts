import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { RaceModel } from './models/race.model';
import { environment } from '../environments/environment';


@Injectable()
export class RaceService {

  constructor(private http: HttpClient) { }
  /**
   * get the list of the pending races
   * @returns Observable<Array<RaceModel>>
   */
  list(): Observable<Array<RaceModel>> {
    const params = { status: 'PENDING' };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
  }

  /**
   * Betting on a pony in a race
   * @param raceId number
   * @param ponyId number
   * @returns Observable<RaceModel>
   */
  bet(raceId: number, ponyId: number): Observable<RaceModel> {
    if (!raceId || !ponyId) { return; }
    return this.http.post<RaceModel>(`${environment.baseUrl}/api/races/${raceId}/bets`, { ponyId });
  }

  /**
   * allowing to get the detail of a race by its ID
   * @param id number
   * @returns Observable<RaceModel>
   */
  get(id: number): Observable<RaceModel> {
    if (!id) { return; }
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${id}`);
  }

}
