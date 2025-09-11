import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //constructor() { }

  private dashboardshow = new BehaviorSubject(false);
   pensionerid = ""

  private showDashboardNav = new BehaviorSubject(false);

  getDashboardNav(): Observable<boolean> {
    return this.showDashboardNav.asObservable();
  }
  setDashboardNav(val: any) {
    this.showDashboardNav.next(val);
  }


  getLoggedIn(): Observable<boolean> {
    return this.dashboardshow.asObservable();
  }

  getLoggedInValue(): boolean {
    return this.dashboardshow.getValue();
  }

  setLoggedIn(val: any) {
    this.dashboardshow.next(val);
  }
}
