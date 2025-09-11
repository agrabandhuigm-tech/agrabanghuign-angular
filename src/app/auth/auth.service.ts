import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';

import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }
  constructor(private router: Router) {}

  login(token:any){
    if(token != ''){
      localStorage.setItem('access_token', token);
      this.loggedIn.next(true);
      this.router.navigate(['/registration']);
    }
  }

  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.loggedIn.next(false);
    // window.open("http://localhost:4200/#/MyDashboard?id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzc29JZCI6IlNBUkRBUktIQU4xOTYzIn0.cnkz6dZAtMz_AtOGGQDU8KCMGSpqBLGiVgByyTup0c8", '_blank')
      // window.location.href= "http://localhost:4200/#/MyDashboard?id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzc29JZCI6IlNBUkRBUktIQU4xOTYzIn0.cnkz6dZAtMz_AtOGGQDU8KCMGSpqBLGiVgByyTup0c8"
    // this.router.navigate([environment.homePagesso]);
    let purl: string = this.router['location']._platformLocation.location.origin;
   
      window.location.href=purl+"/ifmssso/"

  }
}
