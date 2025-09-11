import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

const key = CryptoJS.enc.Utf8.parse('7061737323313233');
const iv = CryptoJS.enc.Utf8.parse('7061737323313233');
export class AppConfig {

  HostUrl: any = 'http://localhost:59776/';

  public readonly ErrorMSG = 'The system is experiencing technical difficulties please ' +
    'refresh the page if the error persists then please login again';

  constructor() {
    //localStorage.setItem('LanType', 'en');
  }

 
  encrypt(text: any) {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
  }
  decrypt(text: any) {
    return CryptoJS.AES.decrypt(text, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  private jwtwithfile(): HttpHeaders {

    // create authorization header with jwt token
    const userinfo = localStorage.getItem('current_user');
    const decryptuserinfo: any = this.decrypt(userinfo);
    const current_user = JSON.parse(decryptuserinfo);
    const headers = new HttpHeaders();
    if (current_user && current_user.Token) {
      headers.set('Authorization', 'Bearer ' + current_user.Token);
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      return headers;
    }
    else {
      return headers;
    }
  }
  public jwt(): HttpHeaders {


    const userinfo = localStorage.getItem('current_user');
    if (userinfo && userinfo !== null && userinfo !== 'null') {
      const decryptuserinfo: any = this.decrypt(userinfo);
      const current_user = JSON.parse(decryptuserinfo);
      if (current_user && current_user.Token) {

            const headers = new HttpHeaders().set('Authorization', 'Bearer ' + current_user.Token);
            return headers;
        
      }
      else {
        const headers = new HttpHeaders().set('Authorization', 'Bearer 0');
        return headers;
      }
    }
    else {
      const headers = new HttpHeaders().set('Authorization', 'Bearer 0');
      return headers;
    }

  }
  storeDetails(key:any,Details:any)
  {
    let enuser:any=this.encrypt(Details);
    sessionStorage.setItem(key,enuser);
  }
  storeUserDetails(userDetails:any)
{
  let enuser:any=this.encrypt(JSON.stringify(userDetails));
  sessionStorage.setItem('userDetails',enuser);

}


getUserDetails()
{
  var enuser:any=sessionStorage.getItem('userDetails');
  if(enuser){
  var dyuser:any=this.decrypt(enuser);
  dyuser=JSON.parse(dyuser);
}else{
  dyuser={"role":"",
  "roleid" :"",
  "officeid":"",
  "treasCode":"",
  "treasName":"",
 "assignmentid":""};
}
  return dyuser;

}
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
 
  getDetails(key:any)
  {
    var enData:any=sessionStorage.getItem(key);
    if(enData){
    var dyuser:any=this.decrypt(enData);
   
    }
    return dyuser;
  }
  jWtencrypt(text: any){
    const sign = require('jwt-encode');
    const secret = 'secret';
    try{
      return sign(text, secret);
    }catch(Error){
      return null
    }
  }

}