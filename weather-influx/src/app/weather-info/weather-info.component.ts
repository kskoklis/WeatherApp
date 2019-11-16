import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';

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
  constructor() { }

  ngOnInit() {
  }


}
