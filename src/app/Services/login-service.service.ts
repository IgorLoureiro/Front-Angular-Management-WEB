import { Injectable } from '@angular/core';
import { enviroment } from '../../app/enviroment'
import { take } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import e from 'express';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  base_url = `${enviroment.config.baseUrl}`;

  constructor(
    private http: HttpClient
  ){ 

  }

  PostRegisterUser(body: any){
    return this.http.post(`${this.base_url}Auth/Register`, body).pipe(take(1));
  };

  PostLoginUser(body: any){
    return this.http.post(`${this.base_url}Auth/Login`, body).pipe(take(1));
  };

  PostRecoverAccount(email: string){
    const body = {
      'email': email
    }
    return this.http.post(`${this.base_url}Auth/SendRecoverAccount`, body).pipe(take(1));
  }

  PostVerifyCodeAndModifyPassword(body: any){
    return this.http.post(`${this.base_url}Auth/VerifyCode`, body).pipe(take(1));
  }
}
