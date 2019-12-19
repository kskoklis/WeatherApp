import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Weather } from "./weather.model";

@Injectable({providedIn: 'root'})
export class WeatherService{
  private weather: Weather[] = [];
  private weatherUpdated = new Subject<Weather[]>();
  constructor(private http: HttpClient) {}

  getWeatherInfo(){
    this.http.get<{message: string, result: any}>('http://83.212.118.254:3000/api/weather')
      .pipe(map((weatherData) => {
        return weatherData.result.map(data => {
          return {
            city: data.name,
            country: data.sys_country,
            icon: data.weather_0_icon,
            temperature: data.last,
            description: data.weather_0_description
          };
        });
      }))
      .subscribe(transformedWeatherData => {
        this.weather = transformedWeatherData;
        this.weatherUpdated.next([...this.weather]);
        console.log(this.weather);
        
      });
  }

  getWeatherUpdateListener(){
    return this.weatherUpdated.asObservable();
  }
}