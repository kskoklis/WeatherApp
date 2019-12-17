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
  weatherinfo: Weather;

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
    .subscribe((result: Weather) => {
      this.weatherinfo = result;
      
      this.temperature = Math.trunc(this.weatherinfo[0].last);
      this.city = this.weatherinfo[0].name;
      this.icon = this.weatherinfo[0].weather_0_icon;
      this.country = this.weatherinfo[0].sys_country;
      this.description = this.weatherinfo[0].weather_0_description;
      this.imgUrl = "../../assets/images/"+this.icon+".png";
      console.log(this.temperature + " city: "+ this.city +" icon: "+ this.icon + " country" +this.country 
      + "desc " + this.description);
    });
  }

  onChange(){
    //console.log(this.cities[].viewValue);
    
  }

}
