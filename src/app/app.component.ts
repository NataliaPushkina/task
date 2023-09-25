import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { map, catchError, reduce, take, skip, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tasks';
  datesList: Array<string> = ['1', '2', '3', '4', '5', '6', '7'];
  temperatureList: Array<number> = [1, 2, 3, 4, 5, 6, 7];
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
  tempDayList: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private _apiService: ApiService) {}

  ngOnInit(): void {
    this.getData();
    this.getTemperature();
  }

  getData() {
    return this._apiService
      .getWeather()
      .pipe(
        map((data) => data.hourly.time),
          skip(23),
          map(item => item.slice(11)),
          take(7),
        catchError(err => {
          console.log('Error:', err);
          throw new Error (err.name);
        })
      )
      .subscribe((d) => {
        console.log(d);
        // this.datesList = d;
      },
      err => console.log('Error:', err));
  }

  getTemperature() {
    return this._apiService
      .getWeather()
      .pipe(
        map((data) => data.hourly.temperature_2m),
        // reduce((accumulator, currentValue) => (accumulator + currentValue) / 23),
        catchError(err => {
          console.log('Error:', err);
          throw new Error (err.name);
        })
      )
      .subscribe((d) => {
        console.log(d);
      },
      err => console.log('Error:', err));
  }
}
