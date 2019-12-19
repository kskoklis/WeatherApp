import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WeatherService } from "./weather.service";
import { Weather } from "./weather.model";

export interface Cities {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.css']
})
export class WeatherInfoComponent implements OnInit {

  cityControl = new FormControl('', [Validators.required]);
  cities: Cities[] = [
    {value: 'city-0', viewValue: 'Athens'},
    {value: 'city-1', viewValue: 'Thessaloniki'},
    {value: 'city-2', viewValue: 'Patra'}
  ];

  private weatherSubscription: Subscription;
  weatherinfo: Weather[];

  city: string;
  country: string;
  icon: string;
  temperature: number;
  description: string;
  imgUrl: string;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.weatherService.getWeatherInfo();
    this.weatherSubscription = this.weatherService.getWeatherUpdateListener()
    .subscribe((result: Weather[]) => {
      this.weatherinfo = result;
      console.log(this.weatherinfo);
      this.setValues(this.weatherinfo)
      
      // console.log(this.temperature + " city: "+ this.city +" icon: "+ this.icon + " country" +this.country 
      // + "desc " + this.description);
    });
  }

  onChange(ev) {
    let city = ev.source.selected.viewValue;
    console.log(city);
    
    
  }

  setValues(infos: Weather[]) {
    this.temperature = Math.trunc(infos[0].temperature);
    this.city = infos[0].city;
    this.icon = infos[0].icon;
    this.country = infos[0].country;
    this.description = infos[0].description;
    this.imgUrl = "../../assets/images/"+this.icon+".png";
  }
}
