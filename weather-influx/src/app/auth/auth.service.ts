import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any ;

  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token;
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(username: string, email: string, password: string ){
    const authdata: AuthData = {username: username, email: email, password: password};
    this.http.post("http://83.212.118.254:3000/api/user/signup", authdata)
    .subscribe(response => {
      this.router.navigate(['/login']);
      console.log(response);
    }, error => {
      this.authStatusListener.next(false);
    });   
  }

  login(username: string, password: string){
    const authdata: AuthData = {username: username, email: null, password: password};
    this.http.post<{token: string, expiresIn: number}>("http://83.212.118.254:3000/api/user/login", authdata)
    .subscribe(response => {
      console.log(response.token);
      const token = response.token;
      this.token = token;
      if (token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        
        this.saveAuthData(token, expirationDate);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}