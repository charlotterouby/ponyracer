import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RaceModel } from './models/race.model';
import { RaceService } from './race.service';

@Injectable()
export class RaceResolverService implements Resolve<RaceModel> {

  constructor(private raceService: RaceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RaceModel> {
    const raceId = +route.paramMap.get('raceId');
    return this.raceService.get(raceId);
  }
}
