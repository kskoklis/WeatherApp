import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchCitiesService } from "./search-cities.service";
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-cities',
  templateUrl: './search-cities.component.html',
  styleUrls: ['./search-cities.component.css']
})
export class SearchCitiesComponent implements OnInit, OnDestroy {

  isLoading = false;
  private citySubscription: Subscription;
  constructor(private searchService: SearchCitiesService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  addCity(form: NgForm) {
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    console.log(form.value.cityName);
    this.searchService.setCitiesIds(form.value.cityName);
    this.citySubscription =  this.searchService.setCityUpdateListener()
    .subscribe((message: string) => {
      this.isLoading = false;
      this.snackBar.open(message, "", {
        duration: 2000
      });
      
    });
    form.reset();
  }

  ngOnDestroy(){
    if(this.citySubscription) {
      this.citySubscription.unsubscribe();
    }
  }

}
