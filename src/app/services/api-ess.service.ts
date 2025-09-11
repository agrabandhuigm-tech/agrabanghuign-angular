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
export class ApiEssService {
  private menuConfig = new BehaviorSubject({ url: 'Inbox' });
  private pensionUrl=environment.pensionUrl;
  private intregationUrl=environment.intregationUrl;
  private empUrl=environment.empUrl;
  private mdmurl=environment.mdmurl;
  private pensionWF=environment.pensionWF;
  private employeeWF=environment.employeeWF;
  private employeeV2=environment.employeeV2;
  private pensionMain=environment.pensionMain;
  private lmdmurl=environment.lmdmurl;
  private home=environment.home;
  private paymanagerUrl="http://172.22.32.203:9030/payManagerUtil/v1.0/";
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
  
    postpension(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);    
      return this.http.post<any>(`${this.pensionUrl}${url}`, data, {headers: this.headers});
    }
    postmdm(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.mdmurl}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postWf(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.pensionWF}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    post(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.employeeWF}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postloantype1(data:any,ACTION:string)
    {
      ACTION = `${this.pensionMain}` + ACTION;
      return this.http.post<any>(ACTION, data,{
       headers: this.headers,
          withCredentials: true 
     });
    }
    homePost(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.home}${url}`, data, {
        headers: this.headers,
        withCredentials: true
      });
    }
  postOr(url: any,data: any)
  {
    this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.intregationUrl}${url}`, data, {
        headers: this.headers
      });
  }
  postlmdm(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.lmdmurl}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postmst(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.employeeV2}${url}`, data, {
        headers: this.headers,     
        withCredentials: true      
      });
    }
    postIntegration(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);    
      return this.http.post<any>(`${this.intregationUrl}${url}`, data, {headers: this.headers});
    }
  
    postIfms(url: any,data: any)
     {
       this.createAuthorizationHeader(this.headers);
         this.headers = new HttpHeaders().append("contentType", "text/xml");
         //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
         return this.http.post(`${this.intregationUrl}${url}`, data, {
           headers: this.headers
         });
     }
  
    private handleError(error: HttpErrorResponse) {
      return throwError(() => error.error);
    }
  
    requestApplication(data:any,ACTION:string)
    {
     // this.url= "https://ifms.rajasthan.gov.in/pension/wf/v1.0/";
     //this.url="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
      ACTION =  (this.url) + ACTION;
      return this.http.post<any>(ACTION, data,{
       headers: this.headers,
          withCredentials: true 
     });
    }
  
  
    requestApplication2(data:any,ACTION:string)
    {
    //this.url="http://ifmstest.rajasthan.gov.in/pension/wf/v1.0/";
      ACTION =  (this.url) + ACTION;
      return this.http.post<any>(ACTION, data,{
       headers: this.headers,
          withCredentials: true 
     });
    }
  
  
    // requestApplication(url: any,data: any)
    // {
    //   alert("update life certificate service calling")
    //   url = url + data;
    //   return this.http.post<any>(url, data,{
    //    headers: this.headers,
    //       withCredentials: true 
    //  });
    // }
    // postIfms(endpoint: string, data: any): Observable<any> {
    //   return this.http.post<any>(this.oracalUrl + endpoint, data)
    //     .pipe(catchError(this.handleError));
    // }
    
    empServicese(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);    
      return this.http.post<any>(`${this.empUrl}${url}`, data, {headers: this.headers});
    }
    userInfo(): any {
      let token: any;
      const IsEss = sessionStorage.getItem('landtoken');
      token = IsEss === '0' ? sessionStorage.getItem('MpJwtToken') : sessionStorage.getItem('jwt_token');
      if (token !== null) {
        return this.config.getDecodedAccessToken(token);
      }
    }
    paymanager(url: any,data: any): Observable<any> {
      this.createAuthorizationHeader(this.headers);    
      return this.http.post<any>(`${this.paymanagerUrl}${url}`, data, {headers: this.headers});
    }
  }
  