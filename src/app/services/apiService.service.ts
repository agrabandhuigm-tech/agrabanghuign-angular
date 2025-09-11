import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  // private apiUrl  = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // testApiRegistration(data: any){
  //   return this.http.post(this.apiUrl + 'dashboardService',{data1: ""});
  // }
}
