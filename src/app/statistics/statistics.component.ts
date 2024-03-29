import { Component, OnInit } from '@angular/core';
import { WeatherService } from "../weather-info/weather.service";
import { Cities } from "../weather-info/cities.model";
import { Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { from } from 'rxjs';
import * as Highcharts from 'highcharts'
import { NgForm, FormBuilder, AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { StatisticsService } from "./statistics.service";
import { Stats } from "./statistics.model";
import { SearchCitiesService } from '../search-cities/search-cities.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  Highcharts = Highcharts;
  startDatee = new Date(2019, 11, 24); // 24 Dec telegraf started 13:00
  startDate: Date;
  endDate: Date;
  cities: Cities[];
  private citiesSubscription: Subscription;
  private statsSubscription: Subscription;
  stats: Stats[] = [];
  tempArray: any = [];
  statsArray: any = [];
  maxStatsArray: any = [];
  meanStatsArray: any = [];
  minStatsArray: any = [];

  timeArray: any = [];
  chartOptions: any;
  firstForm: FormGroup;
  time_period: string;
  customErrors = {required: 'Please choose an option'};
  invalidRadioButton: boolean = false;
  invalidDatePicker: boolean = false;
  isLoading = false;
  constructor(private searchCitiesService: SearchCitiesService, private statisticsService: StatisticsService, private fb: FormBuilder) { 
    console.log(this.startDatee); 
  }

  ngOnInit() {
    this.searchCitiesService.getUserCities();
    this.citiesSubscription = this.searchCitiesService.getCitiesUpdateListener()
    .subscribe((cities: Cities[]) => {
      this.cities = cities;
      console.log(this.cities);
    });
    // this.firstForm = this.fb.group({
    //   cityId: ['', Validators.required],
    //   aggragateFunction: ['', Validators.required],
    //   size: ['', Validators.required]
    // });
  }

  



  setStats(time_period: string, aggragateFunction: string, size: string, id: number){
    
    switch (time_period) {
      case "Last hour":
        if (aggragateFunction) {
          this.statisticsService.getWeatherStats(aggragateFunction, size, id, "59m", "99", "10m");// every 10 m dld last hour
          this.statsSubscription = this.statisticsService.getStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              console.log(this.stats);
              this.timeArray = this.stats.map((obj) => {
                console.log("last hour",obj);
                let utc= obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.statsArray = this.stats.map((obj) => {
                return Math.trunc(obj.statistic_value);
              });
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createGraph(size, aggragateFunction);
            });
          break;
        }
        else {
          this.statisticsService.getAllWeatherStats(size, id, "59m", "99", "10m");// every 10 m dld last hour
          this.statsSubscription = this.statisticsService.getAllWeatherStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              console.log(this.stats);
              this.timeArray = this.stats.map((obj) => {
                console.log("last hour",obj);
                let utc= obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.maxStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.max);
              });
              this.meanStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.mean);
              });
              this.minStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.min);
              });
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createMultilineGraph(size, "Max - Mean - Min");
            });
          break;
        }
      case "Last day":
        if (aggragateFunction) {
          this.statisticsService.getWeatherStats(aggragateFunction, size, id, "24h", "99", "1h"); //every hour dld last day button
          this.statsSubscription = this.statisticsService.getStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              console.log(this.stats);
              this.timeArray = this.stats.map((obj) => {
                let utc = obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.statsArray = this.stats.map((obj) => {
                return Math.trunc(obj.statistic_value);
              });
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createGraph(size, aggragateFunction);
          });
          break;
        }
        else {
          this.statisticsService.getAllWeatherStats(size, id, "24h", "99", "1h");//every hour dld last day button
          this.statsSubscription = this.statisticsService.getAllWeatherStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              console.log(this.stats);
              this.timeArray = this.stats.map((obj) => {
                console.log("last hour",obj);
                let utc= obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.maxStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.max);
              });
              this.meanStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.mean);
              });
              this.minStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.min);
              });
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createMultilineGraph(size, "Max - Mean - Min");
            });
          break;
        }
      case "Last week": //> select mean(main_temp), count(main_temp) from http where "name" = 'Thessaloniki' and time> now() - 6d group by time(1d)
        if (aggragateFunction) {
          this.statisticsService.getWeatherStats(aggragateFunction, size, id, "7d", "99", "6h"); //every day dld last week button
          this.statsSubscription = this.statisticsService.getStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              this.timeArray = this.stats.map((obj) => {
                let utc = obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.statsArray = this.stats.map((obj) => {
                return Math.trunc(obj.statistic_value);
              });
              console.log(this.timeArray);
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createGraph(size, aggragateFunction);
          });
          break;
        }
        else {
          this.statisticsService.getAllWeatherStats(size, id, "7d", "99", "6h"); //every day dld last week button
          this.statsSubscription = this.statisticsService.getAllWeatherStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              console.log(this.stats);
              this.timeArray = this.stats.map((obj) => {
                console.log("last hour",obj);
                let utc= obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.maxStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.max);
              });
              this.meanStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.mean);
              });
              this.minStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.min);
              });
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createMultilineGraph(size, "Max - Mean - Min");
            });
          break;
        }
      case "Last month": //> select mean(main_temp), count(main_temp) from http where "name" = 'Thessaloniki' and time> now() - 29d group by time(1d)
        if (aggragateFunction) {
          this.statisticsService.getWeatherStats(aggragateFunction, size, id, "29d", "99", "1d"); //na to settarw
          this.statsSubscription = this.statisticsService.getStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              this.timeArray = this.stats.map((obj) => {
                let utc = obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.statsArray = this.stats.map((obj) => {
                return Math.trunc(obj.statistic_value);
              });
              console.log(this.timeArray);
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createGraph(size, aggragateFunction);
          });
          break;
        }
        else {
          this.statisticsService.getAllWeatherStats(size, id, "29d", "99", "1d"); //na to settarw
          this.statsSubscription = this.statisticsService.getAllWeatherStatsUpdateListener()
            .subscribe((weatherStats: Stats[]) => {
              this.stats = weatherStats;
              console.log(this.stats);
              this.timeArray = this.stats.map((obj) => {
                console.log("last hour",obj);
                let utc= obj.time;
                let localTime = new Date(utc);
                return localTime;
              });
              this.maxStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.max);
              });
              this.meanStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.mean);
              });
              this.minStatsArray = this.stats.map((obj) => {
                return Math.trunc(obj.min);
              });
              this.startDate = new Date(this.timeArray[0]);
              this.endDate = new Date(this.timeArray[this.timeArray.length-1]);
              this.createMultilineGraph(size, "Max - Mean - Min");
            });
          break;
        }
    
    }
  }


  setCustomStats(aggragateFunction: string, size: string, id: number, start: string, end: string) {
    var dateStart = new Date(start),
    mnthStart = ("0" + (dateStart.getMonth() + 1)).slice(-2),
    dayStart = ("0" + dateStart.getDate()).slice(-2);
    
    var dateEnd = new Date(end),
    mnthEnd = ("0" + (dateEnd.getMonth() + 1)).slice(-2),
    dayEnd = ("0" + dateEnd.getDate()).slice(-2);

    console.log( [dateStart.getFullYear(), mnthStart, dayStart].join("-"));

    if (aggragateFunction) {
      this.statisticsService.getWeatherStats(aggragateFunction, size, id, [dateStart.getFullYear(), mnthStart, dayStart].join("-").toString(), [dateEnd.getFullYear(), mnthEnd, dayEnd].join("-").toString(), "6h");// group by 1h
      this.statsSubscription = this.statisticsService.getStatsUpdateListener()
        .subscribe((weatherStats: Stats[]) => {
          this.stats = weatherStats;
          console.log(this.stats);
          this.timeArray = this.stats.map((obj) => {
            let utc= obj.time;
            let localTime = new Date(utc);
            return localTime;
          });
          this.statsArray = this.stats.map((obj) => {
            return Math.trunc(obj.statistic_value);
          });
          this.createGraph(size, aggragateFunction);
        });
      }
      else {
        this.statisticsService.getAllWeatherStats(size, id, [dateStart.getFullYear(), mnthStart, dayStart].join("-").toString(), [dateEnd.getFullYear(), mnthEnd, dayEnd].join("-").toString(), "6h");// group by 1h
        this.statsSubscription = this.statisticsService.getAllWeatherStatsUpdateListener()
          .subscribe((weatherStats: Stats[]) => {
            this.stats = weatherStats;
            console.log(this.stats);
            this.timeArray = this.stats.map((obj) => {
              let utc= obj.time;
              let localTime = new Date(utc);
              return localTime;
            });
            this.maxStatsArray = this.stats.map((obj) => {
              return Math.trunc(obj.max);
            });
            this.meanStatsArray = this.stats.map((obj) => {
              return Math.trunc(obj.mean);
            });
            this.minStatsArray = this.stats.map((obj) => {
              return Math.trunc(obj.min);
            });
            this.createMultilineGraph(size, "Max - Mean - Min");
          });
      }
  }

  getTimePeriod(event) { //get text from the buttons in first form
    console.log(event.toElement.innerText);
    this.time_period = event.toElement.innerText;
  }

  //submit first form
  onFirstSubmit(form: NgForm){
    if(form.invalid){
      this.invalidRadioButton = true;
      return;
    }
    console.log(form);
    this.invalidRadioButton = false;
    // this.endDate = new Date();
    // switch (this.time_period) {
    //   case "Last hour":
    //     // this.startDate = new Date();
    //   break;
    //   case "Last day":
        
    //     // this.startDate = new Date(this.timeArray[0]);//.setDate(this.endDate.getDate() - 1); //fix this
    //     console.log(this.timeArray[0]);
    //   break;
    // }
    if(form.value.aggragateFunction != "All") {
      this.setStats(this.time_period, form.value.aggragateFunction, form.value.size, form.value.cityId);
    }
    else {
      this.setStats(this.time_period, null, form.value.size, form.value.cityId)
    }
    // setTimeout(() => {
    //   form.reset();
    // }, 2000);

  }

  //submit second form
  onSecondSubmit(form1: NgForm, form2: NgForm) {
    let flag: boolean = false;
    console.log(form1);
    if(form1.invalid){
      this.invalidRadioButton = true;
      flag = true;
    }
    console.log(form2);
    if(form2.invalid){
      this.invalidDatePicker = true;
      flag = true;
    }
    if (flag) return;
    this.invalidDatePicker = false;
    this.invalidRadioButton = false;
    let starttt = form2.value.startDate;
    console.log(starttt);
    if(form1.value.aggragateFunction != "All") {
      this.setCustomStats(form1.value.aggragateFunction, form1.value.size, form1.value.cityId, form2.value.startDate, form2.value.endDate);
    }
    else {
      this.setCustomStats(null, form1.value.size, form1.value.cityId, form2.value.startDate, form2.value.endDate);
      //this.setCustomStats(form1.value.aggragateFunction, form1.value.size, form1.value.cityId, form2.value.startDate, form2.value.endDate);
    }
    // setTimeout(() => {
    //   form1.reset();
    //   form2.reset();
    // }, 2000);

  }

  createGraph(size: string, aggragateFunction: string) {
    this.isLoading = true;
    let graphText: string, graphTitle: string;
    graphTitle = aggragateFunction;
    if (size == "main_humidity") {
      graphText = " %";
      graphTitle += " Humidity";
    }
    else if (size == "main_temp") {
      graphText = " °C";
      graphTitle += " Temperature";
    }
    else if (size == "wind_speed") {
      graphText = " m/s";
      graphTitle += " Wind";
    }
    else {
      graphText = " %";
      graphTitle += " Cloudiness";
    }

    this.chartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text: graphTitle
      },
      xAxis: {
        categories: this.timeArray
      },
      yAxis: {          
        title:{
          text: graphText,
          rotation: 0
        } 
      },
      series: [
        {
          name: this.stats[0].city,
          data: this.statsArray
        }
      ]
    };
    console.log(this.chartOptions);
    this.isLoading = false;
    Highcharts.chart('container',this.chartOptions);
  
  }

  createMultilineGraph(size: string, aggragateFunction: string) {
    this.isLoading = true;
    let graphText: string, graphTitle: string;
    graphTitle = aggragateFunction;
    if (size == "main_humidity") {
      graphText = " %";
      graphTitle += " Humidity";
    }
    else if (size == "main_temp") {
      graphText = " °C";
      graphTitle += " Temperature";
    }
    else if (size == "wind_speed") {
      graphText = " m/s";
      graphTitle += " Wind";
    }
    else {
      graphText = " %";
      graphTitle += " Cloudiness";
    }

    this.chartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text: graphTitle
      },
      xAxis: {
        categories: this.timeArray
      },
      yAxis: {          
        title:{
          text: graphText,
          rotation: 0
        } 
      },
      series: [
        {
          name: this.stats[0].city + " - max",
          data: this.maxStatsArray
        },
        {
          name: this.stats[0].city + " - mean",
          data: this.meanStatsArray
        },
        {
          name: this.stats[0].city + " - min",
          data: this.minStatsArray
        }
      ]
    };
    console.log(this.chartOptions);
    this.isLoading = false;
    Highcharts.chart('container',this.chartOptions);
  
  }
}