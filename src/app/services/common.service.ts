import { Injectable } from '@angular/core';
import * as datahi from '../translations/translation_hi.json'
import * as dataen from '../translations/translation_en.json'
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { CommonDialogueBoxComponent } from 'src/app/main/common-dialogue-box/common-dialogue-box.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  LanType: any = "EN";
  Lang: boolean = true;
  personalProfileDetails: BehaviorSubject<any> = new BehaviorSubject(null)
  getSsoIdToken: any;

  lanJson: any;
  menuItem: any;
  isLocal: boolean = true;
  //ppoDetails:any[] =[];
  imgUrl: any;
  constructor(public router: Router, public apiService: ApiService, public dialog: MatDialog,) {
    this.lanJson = dataen;
    console.log(this.lanJson);
    if (this.isLocal) {
      this.imgUrl = ""
    } else {
      this.imgUrl = "payee-manager/"
    }
  }
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('/', { skipLocationChange: false });
    return this.router.navigateByUrl(url);
  }
  languageHindiChange() {
    this.LanType = "HI";
    this.lanJson = datahi;
    console.log(this.lanJson);
    this.Lang = false;
  }
  languageEngChange() {
    this.LanType = "EN";
    this.lanJson = dataen;
    console.log(this.lanJson);
  }
  menuClick(item: any) {
    this.menuItem = item;

  }
  reverseString(i: string) {
    let reverseString = "";
    for (let char of i) {
      reverseString = char + reverseString;
    }
    return reverseString;
  }
  mask(i: string) {
    console.log("mask number", i);
    let org = this.reverseString(i)
    var main = 0;


    if (i.length > 10) {
      main = Number(org);
      var maskNumber = '';
      var r;
      for (let j = 0; j < i.length; j++) {
        r = main % 10;
        if (j <= 3) {
          maskNumber = maskNumber + r.toString();
        } else if (j >= (i.length) - 4) {
          maskNumber = maskNumber + r.toString();
        }
        else {
          maskNumber = maskNumber + '*';
        }
        let org1 = main / 10;
        main = Math.floor(org1);
        console.log(maskNumber);
      }
    } else if (i.length < 10 && i.length > 4) {
      main = Number(org);
      var maskNumber = '';
      for (let j = 0; j < i.length; j++) {
        r = main % 10;
        if (j <= 1) {
          maskNumber = maskNumber + r.toString();
        } else if (j >= (i.length) - 2) {
          maskNumber = maskNumber + r.toString();
        }
        else {
          maskNumber = maskNumber + '*';
        }
        let org1 = main / 10;
        main = Math.floor(org1);
        console.log(maskNumber);
      }
    }
  }

  updateDocIdnew(data: any) {
    this.apiService.requestApplication2(data, 'updatephotoid').subscribe((res: any) => {
      console.log("res", res)
      if (res.status == 'SUCCESS' && res.data.status == "Success") {
        // if(res.data.status=="Success"){
        // return res.data.msg;
        if ((res.data.msg == 'Data Save Successfully') == true) {
          alert("Data Save Successfully")
          let data1 = res;
          data1["id"] = "SUCCESS";

          this.dialog.open(CommonDialogueBoxComponent, { data: data1, disableClose: false });


        }
        //alert(res.data.msg=='Data Save Successfully')
      }
    });
  }





}
