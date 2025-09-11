import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  private vendorDetail = new BehaviorSubject({});
  currentVendorDetail = this.vendorDetail.asObservable();
  config: AppConfig = new AppConfig();
  constructor() { }
  getVendorDetail(vendordata: any ){
    localStorage.removeItem('vendorData');
    this.vendorDetail.next(vendordata);
    const enData: any =  this.config.encrypt(JSON.stringify(vendordata));
    console.log("common vendor detail", enData);
    localStorage.setItem('vendorData', enData);
  }
}
