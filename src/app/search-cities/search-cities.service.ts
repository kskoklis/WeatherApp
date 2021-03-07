import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { switchMap } from 'rxjs/operators';
import { fromEvent, Subject } from "rxjs";
import { Cities } from '../weather-info/cities.model';
@Injectable({
  providedIn: 'root'
})
export class SearchCitiesService {

  private cityUpdated = new Subject();
  private cityInfo = '';
  private cities: Cities[] = [];
  private citiesUpdated = new Subject<Cities[]>();

  constructor(private http: HttpClient) { }

  setCitiesIds(city: String) {
    this.http.post<{message: string, result: string}>("http://83.212.118.254:3000/api/city/insert", {"name": city})//id , name
    .subscribe(response => {
      console.log(response);
      this.cityInfo = response.message;
      this.cityUpdated.next(this.cityInfo);
    });
  }

  CityUpdateListener(){
    return this.cityUpdated.asObservable();
  }

  getUserCities() {
    this.http.get<{message: string, cities: Cities[]}>("http://83.212.118.254:3000/api/city/cities")
    .subscribe((citiesData) => {
      this.cities = citiesData.cities;
      this.citiesUpdated.next([...this.cities]);
    });
  }
  getCitiesUpdateListener(){
    return this.citiesUpdated.asObservable();
  }

}