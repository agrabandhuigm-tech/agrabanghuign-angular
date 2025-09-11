import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
// import { reasonList } from '../main/employee/emp-common-dialog/json';


@Injectable({
  providedIn: 'root'
})

export class DatashareService {
  // dataEmitted: any[] = [];
  dataEmitted: any = {};
  private selectedHoRoleId = new BehaviorSubject<any>('');
  selectedRoleCast = this.selectedHoRoleId.asObservable();
  public selectedValue = new BehaviorSubject<any>('');
  selectedValueCast = this.selectedValue.asObservable();
  constructor() { }

  setObjValue(data:any){
    this.selectedValue.next(data);
  }




  setData(data: any): void {

    const objkey = Object.keys(data)[0];
    const objval = Object.values(data)[0];
    this.dataEmitted[objkey] = objval;
    // this.dataEmit = {
    //   reqid:333,
    //   sso:'identity',
    // };
    console.log('dataEmitted', this.dataEmitted);

  }

  getData(receiveData: any) {
    this.dataEmitted = receiveData;
    // this.dataEmit['reqid'] = 21424;
  }

  // employee dialog
  getSalaryReasons(offset= 0){
    const response = {
      "status":'SUCCESS',
      "data":{
        // reasonList:reasonList
      },
      'error':null
    };
    return of(response);
  }

  setSelectedHoRoleId(data:any){
    this.selectedHoRoleId.next(data);
  }

}



// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })

// export class DatashareService {
//   dataEmitted: any[] = [];
//   constructor() { }

//   setData(data: any): void {
//     this.dataEmitted.push(data);
//     console.log('dataEmitted',this.dataEmitted);

//   }

//    getData(receiveData:any){
//     this.dataEmitted = receiveData;

//   }


// }
