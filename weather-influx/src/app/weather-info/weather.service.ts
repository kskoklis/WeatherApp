import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Weather } from "./weather.model";

@Injectable({providedIn: 'root'})
export class WeatherService{
  private weather: Weather;
  private weatherUpdated = new Subject<Weather>();
  constructor(private http: HttpClient) {}

  getWeatherInfo(){
    this.http.get<{message: string, result: Weather}>('http://83.212.118.254:3000/api/weather')
      .subscribe((weatherData) => {
        this.weather = weatherData.result;
        this.weatherUpdated.next(this.weather);
        console.log(this.weather);
        
      });
  }

  getWeatherUpdateListener(){
    return this.weatherUpdated.asObservable();
  }
}