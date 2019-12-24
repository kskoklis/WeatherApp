import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Weather } from "./weather.model";
import { Cities } from "./cities.model";

@Injectable({providedIn: 'root'})
export class WeatherService{
  private weather: Weather[] = [];
  private weatherUpdated = new Subject<Weather[]>();
  constructor(private http: HttpClient) {}
  private cities: Cities[] = [];
  private citiesUpdated = new Subject<Cities[]>();

  getWeatherInfo(){
    this.http.get<{message: string, result: any}>('http://83.212.118.254:3000/api/weather/inf')
      .pipe(map((weatherData) => {
        return weatherData.result.map(data => {
          return {
            id: data.id,
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
        //console.log(this.weather);
        
      });
  }

  getWeatherUpdateListener(){
    return this.weatherUpdated.asObservable();
  }

  getWeatherInfoById(id: string){
    this.http.get<{message: string, result: any}>('http://83.212.118.254:3000/api/weather/inf/' + id)
    .pipe(map((weatherData) => {
      return weatherData.result.map(data => {
        return {
          id: data.id,
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

  getCities(){
    this.http.get<{message: string, result: Cities[]}>('http://83.212.118.254:3000/api/weather/towns')
    .subscribe((citiesData) => {
      this.cities = citiesData.result;
      this.citiesUpdated.next([...this.cities])
      console.log(this.cities);
    });
  }

  getCitiesUpdateListener(){
    return this.citiesUpdated.asObservable();
  }
}