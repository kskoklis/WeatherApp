import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { switchMap } from 'rxjs/operators';
import { fromEvent } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class SearchCitiesService {

  constructor(private http: HttpClient) { }

  getCitiesIds() {

    var obj;

    // Temporary use
    this.http.get<any>("https://openweathermap.org/data/2.5/find?callback=jQuery19107484579824848949_1589908196548&q=Trikala&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1589908196549", {responseType: 'text' as 'json'}) //, headers )
      .subscribe(data => {
        let pos = data.indexOf("(");
        pos++;
        data = data.substring(0, data.length-1).substring(pos); //remove jQuery19107484579824848949_1589908196548( to parse json
        console.log(data);
        obj = JSON.parse(data);
        console.log(obj.list[0]);
        // return 1;//obj.list[0];
        this.http.post("http://83.212.118.254:3000/api/city/insert", {"id": obj.list[0].id, "name": obj.list[0].name})//id , name
          .subscribe(response => {
            console.log(response);
          });
      });
  }
}