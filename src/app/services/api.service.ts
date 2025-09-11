import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandler } from '@angular/core';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private baseUrlEss=environment.baseUrlEss;
private menuConfig = new BehaviorSubject({ url: 'Inbox' });
private pensionUrl=environment.pensionUrl;
private intregationUrl=environment.intregationUrl;
private transDetails = new BehaviorSubject('');
public transDetailsCast = this.transDetails.asObservable();
private consentDetails = new BehaviorSubject('');
public consentDetailsCast = this.consentDetails.asObservable();
private empUrl=environment.empUrl;
private mdmurl=environment.mdmurl;
private pensionWF=environment.pensionWF;
private employeeWF=environment.employeeWF;
private employeeV2=environment.employeeV2;
private pensionMain=environment.pensionMain;
private lmdmurl=environment.lmdmurl;
private esignUrlNew=environment.esignUrlNew;

mainurl:any
config:AppConfig=new AppConfig();
  ssoId:any;
  url:any;
   headers = new HttpHeaders();
   getPensionerDtls:any;
  constructor(private http: HttpClient,private _errService:ErrorHandler,public router:Router) {  this.configMenu={isload:true} }
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
  postEmployeeMDM(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.mdmurl}${url}`, data, {
      headers: this.headers,     
      withCredentials: true      
    });
  }
  post(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.pensionWF}${url}`, data, {
      headers: this.headers,     
      withCredentials: true      
    });
  }
  postEmployee(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.employeeWF}${url}`, data, {
      headers: this.headers,     
      withCredentials: true      
    });
  }
  pension(data:any,ACTION:string)
  {
    ACTION = `${this.pensionMain}` + ACTION;
    return this.http.post<any>(ACTION, data,{
     headers: this.headers,
        withCredentials: true 
   });
  }
  postITMS(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(this.pensionMain + endpoint, data, {
      withCredentials: true
    })
      .pipe(catchError(this.handleError));
  }
  getRefreshToken() {
    let purl:string=this.router['location']._platformLocation.location.origin;
    // console.log(purl);
    if(purl.includes("http://localhost") || purl.includes("http://ifmsdev.rajasthan.gov.in" ) )
    {
      this.mainurl = "http://ifmsdev.rajasthan.gov.in/";
      
    }
    else if(purl.includes("https://ifms.rajasthan.gov.in" )) {
    this.mainurl = "https://ifms.rajasthan.gov.in/";
   
    }  else if(purl.includes("https://ifmstest.rajasthan.gov.in" )) {
      this.mainurl = "https://ifmstest.rajasthan.gov.in/";
     
      }
    let url=this.mainurl+"'mp/getRefreshToken";
  // let authToken:any = sessionStorage.getItem('MpJwtToken');
  let authToken:any='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc3Rlc3QucmFqYXN0aGFuLmdvdi5pbiIsImF1ZCI6InRhcmdldFNlcnZpY2UiLCJqdGkiOiJmN2JlYTBlZi00MzU2LTRjMTEtODBjMS03NWNjMjdlMGZmZTciLCJleHAiOjE2OTY5MjU4NjQsImlhdCI6MTY5NjkyNDY2NCwic3ViIjoiSUZNU1RFU1QiLCJ1cG4iOiJJRk1TVEVTVCIsInByZWZlcnJlZF91c2VybmFtZSI6IklGTVMgVE9LRU4iLCJzc29JZCI6IklGTVMuVEVTVCIsImxldmVsVmFsdWVJZCI6bnVsbCwiZGlzcGxheU5hbWUiOiJJRk1TIFRFU1QiLCJyb2xlSWQiOiI0OSIsImxldmVsSWQiOiIxIiwicm9sZU5hbWUiOiJITyIsImVtcGxveWVlSWQiOm51bGwsImxldmVsTmFtZSI6Ik9GRklDRSIsImxldmVsVmFsdWVDb2RlIjoiOTA0IiwidXNlcklkIjoiMSIsImFpZCI6IjkwNDAyIiwidHJlYXNDb2RlIjoiMjEwMCIsImdyb3VwcyI6W119.RTdm480iS79aG5E8MnAIHLBbLSajQkIjJ1kg_ersj0Tc_PCbYCES8ZMxu8vP0F7S_FyVvPBpfs4RialqCDi1p6Xgp92a_Ltvi6rAyX_FDGv-EwtSd7C_xDIjQb4iNXniWW6SYaPYpTwm1SrJCptAFBDFNGAp7ZF6pmN8QwXWoJezsrK9TZhhAGf6dDwMUm_AOtrlwr41Ce3griXKVbx6sCY2Bm7zCpPW9x27lhi2RphZk-8fcdgWbXkRgs0gsNoraeLdZrnms4EFrwE9_AeY3sigNDhud_WEZ-464FQr1HntIWr53dqJDodnk8Xz08Vi_IEXqRlDauObUNEi1Dm4vA'
  if (!authToken) {
    authToken = sessionStorage.getItem('jwt_token');
  }
  const header:HttpHeaders = new HttpHeaders().append("token", authToken);
  const options:any = {
    headers: header,
  }
  return this.http.post(url, {}, options);
}
  postNewEsign(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.esignUrlNew}${url}`, data, {
      headers: this.headers,
      withCredentials: true ,
      responseType: "text",
    });
  }
  postho(url: any,data: any)
  {
    this.createAuthorizationHeader(this.headers);
      this.headers = new HttpHeaders().append("contentType", "text/xml");
      //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post(`${this.pensionWF}${url}`, data, {
        headers: this.headers,
        withCredentials: true
      });
  }
  postEmployeeLmdm(url: any,data: any): Observable<any> {
    this.createAuthorizationHeader(this.headers);
    this.headers = new HttpHeaders().append("contentType", "text/xml");
    //this.headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(`${this.lmdmurl}${url}`, data, {
      headers: this.headers,     
      withCredentials: true      
    });
  }
  postNewEmployee(url: any,data: any): Observable<any> {
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

  postOr(url: any,data: any)
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
   this.url=environment.pensionWF
    ACTION =  (this.url) + ACTION;
    return this.http.post<any>(ACTION, data,{
     headers: this.headers,
        withCredentials: true 
   });
  }

 
  postIfms(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(this.intregationUrl + endpoint, data)
      .pipe(catchError(this.handleError));
  }
  
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
  postmst(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(environment.employeeV2 + endpoint, data)
      .pipe(catchError(this.handleError));
  }
  postemp(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(environment.lmdmurl+ endpoint, data)
      .pipe(catchError(this.handleError));
  }
  
  postlmdm(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>('' + endpoint, data)
      .pipe(catchError(this.handleError));
  }
  postAdv(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(environment.baseURLAdv+ endpoint, data)
      .pipe(catchError(this.handleError));
  }
  postMst(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>('' + endpoint, data)
      .pipe(catchError(this.handleError));
  }
 
  postAdvance(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(environment.baseUrlEss + endpoint, data)
      .pipe(catchError(this.handleError));
  }
  setTransactionDetails(data:any){
    this.transDetails.next(data);
  }
  setConsentDetails(data:any){
    this.consentDetails.next(data);
  }
  postEss(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(this.baseUrlEss + endpoint, data)
      .pipe(catchError(this.handleError));
  }
}
