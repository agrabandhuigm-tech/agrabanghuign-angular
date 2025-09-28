import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandler } from '@angular/core';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private menuConfig = new BehaviorSubject({ url: 'Inbox' });
private mainUrl=environment.pensionUrl;

config:AppConfig=new AppConfig();
  ssoId:any;
  url:any;
   headers = new HttpHeaders();
  constructor(private http: HttpClient,private _errService:ErrorHandler) {  this.configMenu={isload:true} }
  set configMenu(value) {
    this.menuConfig.next(value);
  }

  get configMenu(): any | Observable<any> {
    return this.menuConfig.asObservable();
  }

  createAuthorizationHeader(headers: HttpHeaders) {
  
    headers.append("Content-Type", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Content-Type", "json");
    headers.append("Accept", "application/json");
    headers.append("Accept", "text/xml");
    headers.append("Content-Type", "text/xml");
    headers.append("Content-Type", "application/xml");
    headers.append("Accept", "*/*");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Credentials", "true");
  }

  post(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);    
    return this.http.post<any>(`${this.mainUrl}${url}`, data, {headers: this.headers});
  }
 
}
