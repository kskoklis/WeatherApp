import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

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
      console.log(response);
    });   
  }

  login(username: string, password: string){
    const authdata: AuthData = {username: username, email: null, password: password};
    this.http.post<{token: string}>("http://83.212.118.254:3000/api/user/login", authdata)
    .subscribe(response => {
      console.log(response.token);
      const token = response.token;
      this.token = token;
      if (token){
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }
    });   
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}