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

     const authToken:any= sessionStorage.getItem('jwt_token');
        const modifiedReq = request.clone({
          setHeaders: {Authorization: `Bearer ${authToken.replace(/^["'](.+(?=["']$))["']$/, '$1')}`}
        });
                return next.handle(modifiedReq);        
  }
}

