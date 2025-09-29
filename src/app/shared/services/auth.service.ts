import { EventEmitter, Injectable, Output } from '@angular/core';
import { User } from '../models/user.model';

import * as CryptoJS from 'crypto-js';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment';

const secretKey = environment.CRYPT_SECRET;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() change: EventEmitter<string> = new EventEmitter();

  private _isLoggedIn = new BehaviorSubject <boolean> (this.isLoggedIn());
  private _activeUser = new BehaviorSubject <User | null> (this.getUserInformation());

  authStatus = this._isLoggedIn.asObservable();
  activeUser = this._activeUser.asObservable();

  constructor() { }

  getToken(){
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('PT_CL_TK');
    if (!token){
      return null;
    }else{
      if (!jwtHelper.isTokenExpired(this.decrypt(token))){
        return this.decrypt(token);
      }
      else{
        this.logout();
      }
    }
  }

  signin(token: string){
    localStorage.setItem('PT_CL_TK', this.encrypt(token));
    this.changeAuthStatus(true);
    this.changeLoggedInUser();
  }

  refreshToken(token: string){
    localStorage.setItem('PT_CL_TK', this.encrypt(token));
    this.changeLoggedInUser();
  }

  logout(){
    localStorage.removeItem('PT_CL_TK');
    this.changeAuthStatus(false);
  }

  isLoggedIn(){
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('PT_CL_TK');
    if (!token){
      return false;
    }else{
      if (!jwtHelper.isTokenExpired(this.decrypt(token))){
        return true;
      }
      else{
        localStorage.removeItem('PT_CL_TK');
        return false;
      }
    }

  }

  getUserInformation(){
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('PT_CL_TK');
    if (!token) { return null; }
    if (!jwtHelper.isTokenExpired(this.decrypt(token))){
      let data = jwtHelper.decodeToken(this.decrypt(token)); 
      const result = data as User;   
      return result;
    }else{
      localStorage.removeItem('PT_CL_TK');
      return null;
    }


  }

  changeAuthStatus( value: boolean) {
    this._isLoggedIn.next(value);
  }

  changeLoggedInUser(){
    const activeUser = this.getUserInformation();
    this._activeUser.next(activeUser);
  }

  encrypt(data: string){
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey.trim()).toString();
  }

  decrypt(textToDecrypt: string){
    return JSON.parse(CryptoJS.AES.decrypt(textToDecrypt, secretKey.trim()).toString(CryptoJS.enc.Utf8));
  }
}
