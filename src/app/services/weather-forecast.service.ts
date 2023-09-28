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
  ) {
    this.apiData$ = this._apiService.getWeather();
  }

  getWeekTemperatureList(): Observable<number[]> {
    return this.apiData$.pipe(
      concatMap((data) =>
        from<Array<number>>(data.hourly.temperature_2m).pipe(
          reduce(
            (arr: any, num: number) =>
              arr.splitArrayBySize(num, 24),
            [[]]
          ),
          map((arr: [[number]]) =>
            arr.map((arr) => Math.round(arr.averageNum()))
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
            (arr: any, num: number) => arr.splitArrayBySize(num, 3),
            [[]]
          ),
          map((arr: [[number]]) =>
            arr.map((arr) => Math.round(arr.averageNum()))
          )
        )
      )
    );
  }
}
