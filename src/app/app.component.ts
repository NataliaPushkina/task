import { Component, OnInit } from '@angular/core';
import { WeatherForecastService } from './services/weather-forecast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isActiveDate: boolean = true;
  dateList: Array<string> = [];
  timeList: Array<string> = [
    '0:00',
    '3:00',
    '6:00',
    '9:00',
    '12:00',
    '15:00',
    '18:00',
    '21:00',
  ];
  temperatureWeekList$!: Observable<number[]>;
  temperatureDayList$!: Observable<number[]>;

  constructor(public weatherForecastService: WeatherForecastService) {
    this.dateList = Array(7)
    .fill(7)
    .map((_, i) => {
      const D = new Date();
      D.setDate(D.getDate() + i);
      return D.toLocaleDateString();
    });

  }

  ngOnInit(): void {
    this.temperatureWeekList$ = this.weatherForecastService.getWeekTemperatureList()
    this.temperatureDayList$ = this.weatherForecastService.getDayTemperatureList()
  }
}
