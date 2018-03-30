import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { RaceModel } from './models/race.model';


@Injectable()
export class RaceService {

  private _configUrl = 'http://ponyracer.ninja-squad.com';

  constructor(private http: HttpClient) { }

  list(): Observable<Array<RaceModel>> {
    const params = {status : 'PENDING'};
    return this.http.get<Array<RaceModel>>(`${this._configUrl}/api/races`, { params });
  }

}
