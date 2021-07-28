import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginData } from '../models/login.model';
import { SignUpData } from '../models/sign-up.model';

import { environment } from 'src/environments/environment';

const APIURL = environment.apiUrl + 'users';

@Injectable({providedIn: 'root'})

export class AuthService{

    private token: string;
    private isAuthenticated = false;
    private userId: string;
    private userName: string;
    private emitUserName = new Subject<string>();
    private emitUserId = new Subject<string>();
    private authStatus = new Subject<boolean>();
    expirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }
    
    getIsAuth() {
        return this.isAuthenticated;
    }
    
    getUserId() {
        return this.userId;
    }

    getUserName() {
        return this.userName;
    }
    
    getAuthStatus() {
        return this.authStatus.asObservable();
    }

    getUserNameSub(){
        return this.emitUserName.asObservable();
    }

    getUserIdSub() {
        return this.emitUserId.asObservable();
    }

    signUpUser(username: string, email: string, password: string) {
        const signUpData: SignUpData = {username: username, email: email, password: password};
        this.http.post<{token: string, expiresIn: number, userId: string, username: string}>(APIURL + '/sign-up', signUpData).subscribe(resData => {
            this.authenticateUser(resData.token, resData.userId, resData.expiresIn, resData.username);
        }, err => {
            this.authStatus.next(false);
        });
    }

    loginUser(username: string, password: string) {
        const loginData: LoginData = {username: username, password: password};
        this.http.post<{token: string, expiresIn: number, userId: string, username: string}>(APIURL + '/login', loginData).subscribe(resData => {
            this.authenticateUser(resData.token, resData.userId, resData.expiresIn, resData.username);
        }, err => {
            this.authStatus.next(false);
        });
    }

    autoLogin() {
        const storedData = this.getStoredData();
        if(storedData) {
          const now = new Date();
          const expiresIn = storedData.expDate.getTime() - now.getTime();
          if(expiresIn>0) {
            this.token = storedData.token;
            this.userId = storedData.userId;
            this.isAuthenticated = true;
            this.authStatus.next(true);
            this.userName = storedData.username;
            this.emitUserName.next(storedData.username);
            this.emitUserId.next(storedData.userId);
            this.setAuthTimer(expiresIn/1000);
          }
        }
    }

    logout() {
        this.token = null;
        this.userId = null;
        this.isAuthenticated = false;
        this.authStatus.next(false);
        clearTimeout(this.expirationTimer);
        this.clearStoredData();
        this.router.navigate(['/']);
      }

    private authenticateUser(token: string, userId: string, expiresIn: number, username: string) {
        this.token = token;
        this.userId = userId;
        //set token exp timer
        this.setAuthTimer(expiresIn);
        this.isAuthenticated = true;
        this.authStatus.next(true);
        //calculating expiration date:
        const now = new Date();
        const expDate = new Date(now.getTime() + (expiresIn*1000));
        //save token and date in local storage
        this.storeAuthData(this.token, expDate, this.userId, username);
        this.userName = username;
        this.emitUserName.next(username);
        this.emitUserId.next(userId);
        this.router.navigate(['/']);
      }
    
    private setAuthTimer(duration: number) {
        this.expirationTimer = setTimeout(() => {
          this.logout();
        }, duration*1000);
    }

    private storeAuthData(token: string, expirationDate: Date, userId: string, username: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expDate', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
    }
    
    private clearStoredData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }
    
    private getStoredData() {
        const token = localStorage.getItem('token');
        const expDate = new Date(localStorage.getItem('expDate'));
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        if(!token || !expDate) {
          return;
        }
        return {
          token: token,
          expDate: expDate,
          userId: userId,
          username: username
        };
    }
}