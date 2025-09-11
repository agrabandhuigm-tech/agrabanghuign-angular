import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  let authToken:any= sessionStorage.getItem('jwt_token');
        if(!authToken)
          {
        authToken= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOi8vaWZtc2Rldi5yYWphc3RoYW4uZ292LmluIiwiYXVkIjoidGFyZ2V0U2VydmljZSIsImp0aSI6ImI1NTNlYTJkLTNhYmYtNGMxZi05ZTY3LWIzZTI1ZTExMzQ0OCIsImV4cCI6MTc0Mzc0MzE3NywiaWF0IjoxNzQzNzQxOTc3LCJzdWIiOiJJRk1TVEVTVCIsInVwbiI6IklGTVNURVNUIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSUZNUyBUT0tFTiIsInNzb0lkIjoiUkpEQTIwMTMxMzAxNzE0MSIsImxldmVsVmFsdWVJZCI6bnVsbCwiZGlzcGxheU5hbWUiOiJBUlVOIEdPWUFMIiwicm9sZUlkIjoiMTAyIiwiZGVwdElkIjpudWxsLCJpcEFkZHJlc3MiOiIxMC4yNDQuMS4xIiwiZW1wbG95ZWVJZCI6IlJKREEyMDEzMTMwMTcxNDEiLCJsZXZlbE5hbWUiOiJwZW5zaW9uIiwidXNlcklkIjoiMTA2NjA3IiwiVmVyaWZpZWQiOiJOIiwib2ZmaWNlSWQiOm51bGwsImxldmVsSWQiOiI0NCIsInJvbGVOYW1lIjoicGVuc2lvbiIsImxldmVsVmFsdWVDb2RlIjoiMyIsImFpZCI6IjkwOTM2IiwidHJlYXNDb2RlIjpudWxsLCJncm91cHMiOltdfQ.C8wds5BVcjsu_oBGevjE15OwNVYCNiIdqf4GzZR2e7GxWsGi9L3Dr704L6VrKJI5IqaB09mVsjz7bOuDTs3q_69nbOxX12XtRRICEd3R-2kya1S39AE_5SMSu31v4tptBwoJflZ7s8wgbTQeg6rxDVCOo7wspFx0aN2f0K-hilTXKik2XW1zrZBdtZHwoggmnQI1-Ba5_0E3hfmXdekJaXlEFPlaTJ1b41KzUzUe96IvcKj3WQx9tOOLTnPMSxmyUOpSelpb8kYLUawgig3wd_w9tb-aoojx93nt2zwZUqMqNEZCP22vlCsIy_naY7u-UfDZWXiyhhW3rU4teNqZ4Q';
        }
        authToken= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lmbXN0ZXN0LnJhamFzdGhhbi5nb3YuaW4iLCJhdWQiOiJ0YXJnZXRTZXJ2aWNlIiwianRpIjoiNzMyODczZmUtY2MwZS00OTQzLWExZmItYTQxM2NkOGI1NTZhIiwiZXhwIjoxNzQ3MjI0NjYzLCJpYXQiOjE3NDcyMjM0NjMsInN1YiI6IklGTVNURVNUIiwidXBuIjoiSUZNU1RFU1QiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJJRk1TIFRPS0VOIiwic3NvSWQiOiJSSkRBMjAxMzEzMDE3MTQxIiwibGV2ZWxWYWx1ZUlkIjpudWxsLCJkaXNwbGF5TmFtZSI6IkFSVU4gR09ZQUwiLCJyb2xlSWQiOiIxMDIiLCJkZXB0SWQiOm51bGwsImlwQWRkcmVzcyI6IjEwLjY4LjExNy44NywxMC4yNDQuMi4wIiwiZW1wbG95ZWVJZCI6IlJKREEyMDEzMTMwMTcxNDEiLCJsZXZlbE5hbWUiOiJwZW5zaW9uIiwidXNlcklkIjoiMTA2NjA3IiwiVmVyaWZpZWQiOiJOIiwib2ZmaWNlSWQiOm51bGwsImxldmVsSWQiOiI0NCIsInJvbGVOYW1lIjoicGVuc2lvbiIsImxldmVsVmFsdWVDb2RlIjoiMyIsImFpZCI6IjkwOTM2IiwidHJlYXNDb2RlIjpudWxsLCJncm91cHMiOltdfQ.PoPTDNLsiAa6WMCBMzCyRntfMop85m924infR7kmRN-ctDgNC3CSy7fasP_BZATL824uBqLr_KB-PJRJyZNd-n7EfhSHomTZiS_YLBMqHCDvsfLHIS3nauxcdajBHN5Ax8xd5flYvkNd9Y2OZGSlXcNsoxwTpIJROEf87B6zwltAl9gii0l3mBh4o_mJ10fsPGpdDhYXqqC86LtrpIb0ecBq3wcQqNTm7iquioeMXZhhj1eBif6dMJMCbUhcftU5xg7u1Ek-NfMYxV3dU3Z1WEoIbwj37TR_sEM8tX8-RgIdo1Qr22TfPg3p4w43Xnc58JVNCdqZb012aecfEvRyaA';
        const modifiedReq = request.clone({
          setHeaders: {Authorization: `Bearer ${authToken.replace(/^["'](.+(?=["']$))["']$/, '$1')}`}
        });
                return next.handle(modifiedReq);        
  }
}

