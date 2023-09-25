import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import {
  Observable,
  map,
  catchError,
  reduce,
  take,
  filter,
  concatMap,
  from,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tasks';
  datesList: Array<string> = [];
  temperatureList: Array<number> = [];
  isActiveDate: boolean = true;
  timeList: Array<string> = [
    '00:00',
    '03:00',
    '06:00',
    '09:00',
    '12:00',
    '15:00',
    '18:00',
    '21:00',
  ];
  tempDayList: Array<number> = [];
  o$!: Observable<any>;

  constructor(private _apiService: ApiService) {}

  ngOnInit(): void {
    this.o$ = this._apiService.getWeather();
    this._getData();
    this._getTemperature();
    this._getTempDayList();
  }

  _getData() {
    return this.o$
      .pipe(
        concatMap((data) =>
          from(data.hourly.time).pipe(
            tap((_v: any) => console.log('pipe')),
            map((item: string) => item.slice(0, 10)),
            filter((_value, i) => i % 24 === 0),
            take(7)
          )
        ),
        catchError((err) => {
          console.log('Error:', err);
          throw new Error(err.name);
        })
      )
      .subscribe(
        (d) => {
          this.datesList.push(d);
        },
        (err) => console.log('Error:', err)
      );
  }

  _getTemperature() {
    return this.o$
      .pipe(
        concatMap((data) =>
          from(data.hourly.temperature_2m).pipe(
            tap((v: any) => console.log('pipe')),
            reduce(
              (p: any, c: number) => {
                if (p[p.length - 1].length == 24) {
                  p.push([]);
                }
                p[p.length - 1].push(c);
                return p;
              },
              [[]]
            )
          )
        )
      )
      .subscribe(
        (d) => {
          this.temperatureList = d.map((arr: [any]) =>
            Math.round(this._averageNum(arr))
          );
        },
        (err) => console.log('Error:', err)
      );
  }

  _getTempDayList() {
    return this.o$
      .pipe(
        concatMap((data) =>
          from(data.hourly.temperature_2m).pipe(
            tap((v: any) => console.log('pipe')),
            take(24),
            reduce(
              (p: any, c: number) => {
                if (p[p.length - 1].length == 3) {
                  p.push([]);
                }
                p[p.length - 1].push(c);
                return p;
              },
              [[]]
            )
          )
        )
      )
      .subscribe(
        (d) => {
          console.log(d);
          this.tempDayList = d.map((arr: [any]) =>
            Math.round(this._averageNum(arr))
          );
        },
        (err) => console.log('Error:', err)
      );
  }

  _averageNum(arr: [any]) {
    return arr.reduce((sum, a) => sum + a, 0) / arr.length;
  }
}
