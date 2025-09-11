import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { LoaderService } from 'src/app/services/loader.service';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-change-monthly-treasury',
  templateUrl: './change-monthly-treasury.component.html',
  styleUrls: ['./change-monthly-treasury.component.scss']
})
export class ChangeMonthlyTreasuryComponent implements OnInit {
  treasurylist: any;
  treasuryFrom:any;
  myControl = new FormControl('');
  // loginDetails: any;
  userDetails: any;
  config: AppConfig = new AppConfig();
  treasCode: any;
  profileDetails: any;
  pensionerDtls:any;
  bankVerify:number=0;
  MonthlyTreaseryDetailList:any;
  value:any;
  type:any='E';
  psnDtls:any;
    @Input() monthly: Subject<boolean>;
  constructor(private _Service : ApiService, 
    private routers: Router,
    public dialog: MatDialog, private fb: FormBuilder,private snackbar:SnackbarService,public common:CommonService ,private load:LoaderService) { }
    user:any;
  ngOnInit(): void {
    this.getTreasury();
     this.userDetails = this.config.getUserDetails();     
     this.user = this._Service.userInfo();
     console.log( "info",this.user)
     this.value = this.user?.employeeId;
     this.type = 'E';
     this.getPensionDBData();
     this.monthly.subscribe(v => {
      this.submit()
     });
  }
currentTrasuryName:any;
treasuryCode:any;
updateTreasuryCode:any;
  getPensionDBData()
  {
    if(!this.value)
      {
          this.common.openErrorModal("Enter Value","",()=>{});
          return;
      }   
      this.common.getPensionDBData(this.value,this.type,7,(res:any)=>{      
        if(JSON.stringify(res).includes("no data available"))
          {}else{
            this.psnDtls=res.data[0];
           console.log("pensioner details",this.psnDtls)
          }
      })
      this.common.getPensionDBData(this.value,this.type,1,(res:any)=>{
        console.log("pension Data1",res);
        if(JSON.stringify(res).includes("no data available"))
          {}else{
            console.log("ppo details",res.data[0]?.mthPsnTreasuryCode)
            this.treasuryCode=res.data[0]?.mthPsnTreasuryCode;
            this.updateTreasuryCode=res.data[0]?.mthPsnTreasuryCode;
            this.currentTrasuryName= this.treasurylist.filter((x:any)=>x.treasCode==this.treasuryCode)[0]?.treasNameEn;           
          }
      })
  }




 

  getTreasury() {
    let data = {
      "attrValue": 2
    }   
    this._Service.pension(data, "getpensiontreasury").subscribe({
      next: (res:any) => {
        console.log(res)
        if (res.status = 200) {
          this.treasurylist = res.data
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err
        }
      }
    })
  }
  isChange:boolean=false;
  changeMPT()
  {
    this.isChange=true;
  }
@Output() EmpData = new EventEmitter();
@Input() skipData: Subject<boolean>;
  submit(){
    if(this.updateTreasuryCode==this.treasuryCode)
    {
      this.common.openErrorModal("Please select different treasury",'');
      return;
    }
  
    if(Number(this.docId)<1  || this.docId==undefined)
      {
        this.common.openErrorModal("Please upload valid document",'');
        return;
      }
  let data1={
    'pensionerId':this.psnDtls.pensionerId,
    "monthlyPensionTreasury":this.updateTreasuryCode,
    'assignmentId':this.userDetails.assignmentid,
    "docId":this.docId,
    'ipAddress':this.userDetails?.ipAddress
  }
  console.log("submit data",data1);
  const data = { value: data1 ,step:3 };
  console.log("monthly",data);
  this.EmpData.emit(data); 

    


  }
  @Output() uploadData = new EventEmitter();
  @Input() docId: any;
  uploadFile(event:any)
  {
    console.log("file",event);
    this.uploadData.emit(event); 
  }
  removeDoc()
  {
    this.docId=null;
  }


 

}
