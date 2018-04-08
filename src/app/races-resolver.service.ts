import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RaceModel } from './models/race.model';
import { RaceService } from './race.service';

@Injectable()
export class RacesResolverService implements Resolve<Array<RaceModel>> {

  constructor(private raceService: RaceService) { }

  // tslint:disable-next-line:max-line-length
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<RaceModel>> | Promise<Array<RaceModel>> | Array<RaceModel> {
    const status = route.routeConfig.path.toUpperCase();
    return this.raceService.list(status);
  }

}
