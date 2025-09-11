import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isAuthenticated: boolean)=>{
        let jwttoken = localStorage.getItem('access_token');
        // alert(jwttoken);
        if (!isAuthenticated && (jwttoken == null || jwttoken == undefined || jwttoken == '')) {
          // this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    )
  }
}
