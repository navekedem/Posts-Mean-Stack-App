import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthModel } from './autn.model';
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isUserAuth = false;
  private token: string;
  private tokenTimer: any;
  private authStatus = new Subject<boolean>();
  constructor(public http: HttpClient , private router: Router) {

  }

  getToken() {
    return this.token;
  }
  getIsUserAuth() {
    return this.isUserAuth;
  }

  getAuthStatusListener(){
    return this.authStatus.asObservable();
  }

  createUser(email: string , password: string) {
    const authData : AuthModel = {
      email: email,
      password: password,
    };
    this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(response => {
      console.log(response);
    })
  }

  login(email: string , password: string) {
    const authData : AuthModel = {
      email: email,
      password: password,
    };
    this.http.post<{token: string , expiresIn: number}>("http://localhost:3000/api/user/login", authData).subscribe(response => {
      this.token = response.token;
      if(this.token) {
        const expiresTime = response.expiresIn;
        this.setTokenTimer(expiresTime);
        this.isUserAuth = true;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresTime * 1000);
        this.saveAuthDataInStorage(this.token, expirationDate);
        this.authStatus.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresTime = authInformation.expiresIn.getTime() - now.getTime();
    if(expiresTime > 0){
      this.token = authInformation.token;
      this.setTokenTimer(expiresTime / 1000)
      this.isUserAuth = true;
      this.authStatus.next(true);
    }
  }

  private setTokenTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000);
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expiresDate = localStorage.getItem("expiresIn");
    if(!token || !expiresDate){
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expiresDate)
    }
  }
  private saveAuthDataInStorage (token: string , expiresIn: Date){
    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiresIn.toISOString());
  }

  private removeAuthDataInStorage (){
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
  }

  logout(){
    this.token = null;
    this.isUserAuth = false;
    this.authStatus.next(false);
    this.removeAuthDataInStorage();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

}
