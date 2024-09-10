import { HttpClient } from '@angular/common/http';
import { afterNextRender, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../Base/environment';
import { Login, Register } from '../interfaces/register';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private _http: HttpClient, private _router: Router) { 
    afterNextRender(() => {
      if(localStorage.getItem('userToken') != null){
        this.userInformation();
      }
    })
  }

  register(formData : Register):Observable<any>{
    return this._http.post(`${environment.baseUrl}/auth/signup`, formData)
  }

  login(formData : Login):Observable<any>{
    return this._http.post(`${environment.baseUrl}/auth/signin`, formData)
  }

  userInformation(){
    let decoded = jwtDecode(JSON.stringify(localStorage.getItem('userToken')));
    this.userData.next(decoded);
  }

  forgetPassword(email: string):Observable<any>{
    return this._http.post(`${environment.baseUrl}/auth/forgotPasswords`, {
      email: email
    })
  }

  verifyCode(code: string):Observable<any>{
    return this._http.post(`${environment.baseUrl}/auth/verifyResetCode`, {
      resetCode: code
    })
  }

  resetPassword(email: string, password: string):Observable<any>{
    return this._http.put(`${environment.baseUrl}/auth/resetPassword`, {
      email: email,
      newPassword: password
    })
  }

}
