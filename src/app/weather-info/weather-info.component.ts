import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WeatherService } from "./weather.service";
import { Weather } from "./weather.model";
import { Cities } from "./cities.model";


@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.css']
})
export class WeatherInfoComponent implements OnInit, OnDestroy {

  isLoading = false;
  cityControl = new FormControl('', [Validators.required]);
  private weatherSubscription: Subscription;
  private citiesSubscription: Subscription;
  weatherinfo: Weather[];
  cities: Cities[];

  id: string;
  city: string;
  country: string;
  icon: string;
  temperature: number;
  description: string;
  imgUrl: string;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.isLoading = true;
    this.weatherService.getWeatherInfo();
    this.weatherService.getCities();
    this.weatherSubscription = this.weatherService.getWeatherUpdateListener()
    .subscribe((result: Weather[]) => {
      this.isLoading = false;
      this.weatherinfo = result;
      
      this.setValues(this.weatherinfo);
    });
    this.citiesSubscription = this.weatherService.getCitiesUpdateListener()
    .subscribe((t: Cities[]) => {
      this.cities = t;
    });
  }

  onChange(ev) {
    let city = ev.source.selected.viewValue;
    let id = ev.value;
    this.weatherService.getWeatherInfoById(id);
  }

  setValues(infos: Weather[]) {
    this.temperature = Math.trunc(infos[0].temperature);
    this.id = infos[0].id;
    this.city = infos[0].city;
    this.icon = infos[0].icon;
    this.country = infos[0].country;
    this.description = infos[0].description;
    this.imgUrl = "../../assets/images/"+this.icon+".png";
  }

  ngOnDestroy(){
    this.weatherSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
  }
}
