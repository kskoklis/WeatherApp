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

  cityControl = new FormControl('', [Validators.required]);
  // cities: Cities[] = [
  //   {id: '264371', name: 'Athens'},
  //   {id: '734077', name: 'Thessaloniki'},
  //   {id: '255683', name: 'Patra'}
  // ];

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
    this.weatherService.getWeatherInfo();
    this.weatherService.getCities();
    this.weatherSubscription = this.weatherService.getWeatherUpdateListener()
    .subscribe((result: Weather[]) => {
      this.weatherinfo = result;
      console.log(this.weatherinfo);
      this.setValues(this.weatherinfo);
      
      // console.log(this.temperature + " city: "+ this.city +" icon: "+ this.icon + " country" +this.country 
      // + "desc " + this.description);
    });
    this.citiesSubscription = this.weatherService.getCitiesUpdateListener()
    .subscribe((t: Cities[]) => {
      this.cities = t;
      console.log(this.cities);
      
    });
  }

  onChange(ev) {
    let city = ev.source.selected.viewValue;
    console.log(city);
    console.log(ev.value);
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

  getTowns(){
    this.weatherService.getCities();
  }

  setCities(){

  }
  ngOnDestroy(){
    this.weatherSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
  }
}
