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
  private userId: string;
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
  getUserId(){
    return this.userId;
  }

  createUser(email: string , password: string) {
    const authData : AuthModel = {
      email: email,
      password: password,
    };
    this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(response => {
      console.log(response);
      this.router.navigate(['/login']);
    })
  }

  login(email: string , password: string) {
    const authData : AuthModel = {
      email: email,
      password: password,
    };
    this.http.post<{token: string , expiresIn: number , userId: string}>("http://localhost:3000/api/user/login", authData).subscribe(response => {
      this.token = response.token;
      if(this.token) {
        const expiresTime = response.expiresIn;
        this.setTokenTimer(expiresTime);
        this.isUserAuth = true;
        this.userId = response.userId;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresTime * 1000);
        this.saveAuthDataInStorage(this.token, expirationDate , this.userId);
        this.authStatus.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresTime = authInformation.expiresIn.getTime() - now.getTime();
    if(expiresTime > 0){
      this.token = authInformation.token;
      this.setTokenTimer(expiresTime / 1000);
      this.userId = authInformation.userId;
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
    const userId = localStorage.getItem("userId");

    if(!token || !expiresDate){
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expiresDate),
      userId: userId
    }
  }
  private saveAuthDataInStorage (token: string , expiresIn: Date , userId:string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiresIn.toISOString());
    localStorage.setItem("userId", userId);
  }

  private removeAuthDataInStorage (){
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("userId");

  }

  logout(){
    this.token = null;
    this.isUserAuth = false;
    this.authStatus.next(false);
    this.userId = null;
    this.removeAuthDataInStorage();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

}
