import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandler } from '@angular/core';
import { AppConfig } from '../app.config';
import { Action } from 'rxjs/internal/scheduler/Action';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private menuConfig = new BehaviorSubject({ url: 'Inbox' });
  private mainUrl = environment.pensionUrl;

  config: AppConfig = new AppConfig();
  ssoId: any;
  url: any;
  headers = new HttpHeaders();
  constructor(private http: HttpClient, private _errService: ErrorHandler, private loader: LoaderService) { this.configMenu = { isload: true } }
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

  post(url: any, data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.loader.show();
    return this.http.post<any>(`${this.mainUrl}${url}`, data, { headers: this.headers }).pipe(
      finalize(() => {
        this.loader.hide();
      })
    );
  }

  postITMS(url: any, data: any): Observable<any> {
    return this.post(url, data);
  }

  get(url: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.loader.show();
    return this.http.get<any>(`${this.mainUrl}${url}`, { headers: this.headers }).pipe(
      finalize(() => {
        this.loader.hide();
      })
    );
  }

  postIntegration(url: any, data: any): Observable<any> {
    return this.post(url, data);
  }

}
