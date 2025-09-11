import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { ConnectableObservable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-vendor-submit-dialog',
  templateUrl: './vendor-submit-dialog.component.html',
  styleUrls: ['./vendor-submit-dialog.component.scss']
})
export class VendorSubmitDialogComponent implements OnInit {
role:any;
msg:any;
config: AppConfig = new AppConfig();
userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
  constructor( @Inject(MAT_DIALOG_DATA) public data: {message: string, redirectionPath: string}, private router: Router ,public dialog: MatDialog,) {
    this.userDetails=this.config.getUserDetails();
this.role=this.userDetails.role;
   }

  ngOnInit(): void {
    console.log("vendor dialog",this.data.message);
    if(this.role=='VENDOR')
    {
this.msg="Submit Successfully.";
    }
    else{
      this.msg=this.data.message;
    }
  }

  onSubmit(){

  }

  redirectToDashboard(){
    this.router.navigate([this.data.redirectionPath]);
    
    this.dialog.closeAll();
  }

}
