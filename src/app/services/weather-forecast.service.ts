import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  Observable,
  map,
  catchError,
  reduce,
  take,
  concatMap,
  from,
} from 'rxjs';
import { UtilsService } from './utils.service';
import { WeatherInfo } from '../models/WeatherInfo';

@Injectable({
  providedIn: 'root',
})
export class WeatherForecastService {
  apiData$: Observable<WeatherInfo>;
  temperatureWeekList$!: Observable<number[]>;
  temperatureDayList$!: Observable<number[]>;

  constructor(
    private _apiService: ApiService,
    private _utilsService: UtilsService
  ) {
    this.apiData$ = this._apiService.getWeather();
  }

  getWeekTemperatureList(): Observable<number[]> {
    return this.apiData$.pipe(
      concatMap((data) =>
        from<Array<number>>(data.hourly.temperature_2m).pipe(
          reduce(
            (p: any, c: number) =>
              this._utilsService.splitArrayBySize(p, c, 24),
            [[]]
          ),
          map((arr: [[number]]) =>
            arr.map((array) => Math.round(this._utilsService.averageNum(array)))
          )
        )
      ),
      catchError((err) => {
        console.log('Error:', err);
        throw new Error(err.name);
      })
    );
  }

  getDayTemperatureList(): Observable<number[]> {
    return this.apiData$.pipe(
      concatMap((data) =>
        from<Array<number>>(data.hourly.temperature_2m).pipe(
          take(24),
          reduce(
            (p: any, c: number) => this._utilsService.splitArrayBySize(p, c, 3),
            [[]]
          ),
          map((arr: [[number]]) =>
            arr.map((array) => Math.round(this._utilsService.averageNum(array)))
          )
        )
      )
    );
  }
}
