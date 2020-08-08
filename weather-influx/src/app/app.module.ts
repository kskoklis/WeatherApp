import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule} from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LayoutComponent } from './layout/layout.component';
import { MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatIconModule,
          MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule, MatMenuModule,
          MatDatepickerModule, MatNativeDateModule, MatGridListModule, MatDividerModule,
          MatRadioModule, MatSnackBarModule, MatDialogModule } from '@angular/material/';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HeaderComponent } from './header/header.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AuthInterceptor } from "./auth/auth-interceptor";
import { WeatherInfoComponent } from './weather-info/weather-info.component';
import { SearchCitiesComponent } from './search-cities/search-cities.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    StatisticsComponent,
    WeatherInfoComponent,
    SearchCitiesComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatDividerModule,
    MatRadioModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
