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

    var obj;
    // let getReq = this.http.get<string>("https://openweathermap.org/data/2.5/find?callback=jQuery19107484579824848949_1589908196548&q=Trikala&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1589908196549", {responseType: 'text' as 'json'}); //, headers )

    // let postReq = this.http.post("http://83.212.118.254:3000/api/city/insert", cityValues);

    // getReq.pipe(switchMap( data => {
    //   let pos = data.indexOf("(");
    //   pos++;
    //   data = data.substring(0, data.length-1).substring(pos); //remove jQuery19107484579824848949_1589908196548( to parse json
    //   console.log(data);
    //   obj = JSON.parse(data);
    //   console.log(obj.list[0]);
    //   id = obj.list[0].id;
    //   name = obj.list[0].name;
    //   cityValues = {"id": id, "name": name};
    //   console.log(cityValues);
    //   return postReq //post has empty body
    // })).subscribe( (value) => {
    //   console.log(value);
    // });
    // Temporary use
    this.http.get<any>("https://openweathermap.org/data/2.5/find?callback=jQuery19107484579824848949_1589908196548&q="+city+"&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1589908196549", {responseType: 'text' as 'json'}) //, headers )
      .subscribe(data => {
        let pos = data.indexOf("(");
        pos++;
        data = data.substring(0, data.length-1).substring(pos); //remove jQuery19107484579824848949_1589908196548( to parse json
        console.log(data);
        obj = JSON.parse(data);
        if (obj.list.length == 0) {
          this.cityInfo = "City not found!";
          this.cityUpdated.next(this.cityInfo);
        } 
        else {
          console.log(obj.list[0]);
          this.http.post<{message: string, result: string}>("http://83.212.118.254:3000/api/city/insert", {"id": obj.list[0].id, "name": obj.list[0].name})//id , name
          .subscribe(response => {
            console.log(response);
            this.cityInfo = response.message;
            this.cityUpdated.next(this.cityInfo);
          });
        }
      });
  }

  setCityUpdateListener(){
    return this.cityUpdated.asObservable();
  }

  getUserCities() {
    this.http.get<{message: string, cities: Cities[]}>("http://83.212.118.254:3000/api/city/cities")
    .subscribe((citiesData) => {
      this.cities = citiesData.cities;
      this.citiesUpdated.next([...this.cities]);
    });
  }
  getUserCitiesUpdateListener(){
    return this.citiesUpdated.asObservable();
  }

}