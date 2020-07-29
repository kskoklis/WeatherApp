import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { WeatherInfoComponent } from './weather-info/weather-info.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SearchCitiesComponent } from "./search-cities/search-cities.component";

const routes: Routes = [
  { path: '', component: WeatherInfoComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'stats', component: StatisticsComponent},
  { path: 'search', component: SearchCitiesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
