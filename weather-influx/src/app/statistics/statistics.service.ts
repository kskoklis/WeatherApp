import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Stats } from "./statistics.model";


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private statsUpdated = new Subject<Stats[]>(); //add generic type <>
  private statistics: Stats[] = []; 

  constructor(private http: HttpClient) { }
  //get mean temperature here
  getWeatherStats(fun, size, city, start, end, period){
    this.http.get<{message: string, result: any}>("http://83.212.118.254:3000/api/stats/one/" + fun + "/" + size + "/" + city + "/" + start + "/" + end + "/" + period)
      .pipe(map((statsData) => {
        let cityArr = statsData.result[1].map(data => {
          return data.name  ;
        });
        
        return statsData.result[0].map(stat => {    
          if (stat.mean) {
            return {
              time: stat.time,
              statistic_value: stat.mean,
              city: cityArr[0]
            };
          }
          else if (stat.min) {
            return {
              time: stat.time,
              statistic_value: stat.min,
              city: cityArr[0]
            };
          }
          else if (stat.max) {
            return {
              time: stat.time,
              statistic_value: stat.max,
              city: cityArr[0]
            };
          }
        });       
      }))
      .subscribe(transformedStatsData => {
        console.log(transformedStatsData);
        this.statistics = transformedStatsData;
        this.statsUpdated.next([...this.statistics])
      });
      
  }

  getStatsUpdateListener(){
    return this.statsUpdated.asObservable();
  }

  //get all functions
  getAllWeatherStats(size, city, start, end, period){
    this.http.get<{message: string, result: any}>("http://83.212.118.254:3000/api/stats/all/" + size + "/" + city + "/" + start + "/" + end + "/" + period)
      .pipe(map((statsData) => {
        let cityArr = statsData.result[1].map(data => {
          return data.name;
        });
        
        return statsData.result[0].map(stat => {    
          return {
            time: stat.time,
            max: stat.max,
            mean: stat.mean,
            min: stat.min,
            city: cityArr[0]
          };
        });       
      }))
      .subscribe(transformedStatsData => {
        console.log(transformedStatsData);
        this.statistics = transformedStatsData;
        this.statsUpdated.next([...this.statistics])
      });
  }

  getAllWeatherStatsUpdateListener(){
    return this.statsUpdated.asObservable();
  }
}
