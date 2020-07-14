import { Component, OnInit } from '@angular/core';
import { SearchCitiesService } from "./search-cities.service";
@Component({
  selector: 'app-search-cities',
  templateUrl: './search-cities.component.html',
  styleUrls: ['./search-cities.component.css']
})
export class SearchCitiesComponent implements OnInit {

  constructor(private searchService: SearchCitiesService) { }

  ngOnInit() {
  }

  getCit() {
    this.searchService.getCitiesIds();
  }

}
