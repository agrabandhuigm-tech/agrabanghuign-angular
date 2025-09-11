import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { RedirectService } from 'src/app/services/redirect.service';
import { LoaderService } from 'src/app/services/loader.service';

import { ApiUrlService } from 'src/app/services/api-url.service';



@Component({
  selector: 'app-common-dialogue-box',
  templateUrl: './common-dialogue-box.component.html',
  styleUrls: ['./common-dialogue-box.component.scss']
})

export class CommonDialogueBoxComponent implements OnInit {
  message: any;
  id: any;
  reqId: any;
  status1: any;
  isVisible: boolean = false;
  isImageshow: boolean = false;
  DataSoonPopUp: boolean = false;
  CommutationSuccess: boolean = false;

  isFamilyDetails: boolean = false;
  isHid: any;
  btn: boolean = false;
  config: AppConfig = new AppConfig();
  familyDet: any[] = [];
  userData: any
  mobNo: any;
  otpVer: any
  isOtpVer: boolean = false;
  otpData: any;
  otp: any;
  mobileNo: any;
  imageUrl: any;
  familyDtlForm!: FormGroup;
  actionType: any;
  resData1: any;
  resData2: any; // Msg Box Rquest Id // 


  // isVisible:Boolean=false;
  constructor(
    private router: Router, @Inject(MAT_DIALOG_DATA)
    public data: { getEventStatus: any, res: any, index: any, otpData: any, mobileNo: any, Actiontype: any, resData: any },
    private dialogRef: MatDialogRef<CommonDialogueBoxComponent>,
    public dialog: MatDialog,
    public apiService: ApiService,
    public api: ApiService,
    private formbuilder: FormBuilder,
    private modalService: NgbModal,
    private routers: Router, private http: HttpClient,
    private redirectService: RedirectService,
    public load: LoaderService,
    public apiurl: ApiUrlService,
    private _snackBar: MatSnackBar,

  ) {

    this.status1 = "SUCCESS";
    dialogRef.disableClose = true;
    this.familyDet = this.data.res;
    this.mobNo = this.data.mobileNo;
    this.otpData = this.data.otpData;
    this.actionType = this.data.Actiontype;
    this.resData1 = this.data.resData;
    this.resData2 = this.data.resData;
    // this.resData=this.data.res;

  }



  ngOnInit(): void {

    this.imageUrl = this.familyDet;
    //alert( this.actionType)
    //  console.log(this.actionType)
    //  console.log(this.familyDet)
    if (this.actionType == 'CommutationSuccess') {

      console.log(this.familyDet)
      this.DataSoonPopUp = false;
      this.isVisible = false;
      this.isFamilyDetails = false;
      this.isOtpVer = false;
      this.isImageshow = false;
      this.CommutationSuccess = true;
    }
    else if (this.actionType == 'ComingSoon') {
      this.DataSoonPopUp = true;
      this.isVisible = false;
      this.isFamilyDetails = false;
      this.isOtpVer = false;
      this.isImageshow = false;
      this.CommutationSuccess = false;
    }
    else if (this.mobNo != '') {
      this.isOtpVer = true;
      this.isVisible = false;
      this.isFamilyDetails = false;
      this.isImageshow = false;
      this.DataSoonPopUp = false;
      this.CommutationSuccess = false;
    }
    if (this.familyDet[this.data.index] != "") {
      this.userData = this.familyDet[this.data.index]

      if (this.userData != null && this.userData.pensionerId != '') {
        this.isFamilyDetails = true;
        this.isVisible = false;
        this.isOtpVer = false;
        this.isImageshow = false;
        this.DataSoonPopUp = false;
        this.CommutationSuccess = false;
      }
      else {
        this.isVisible = false;
        this.isFamilyDetails = false;
        this.isOtpVer = false;
        this.isImageshow = true;
        this.DataSoonPopUp = false;
        this.CommutationSuccess = false;
      }
    }
    this.familyDtlForm = this.formbuilder.group({
      familyMemberId: new FormControl(this.userData.familyMemberId, Validators.required),
      pensionerId: new FormControl(this.userData.pensionerId, Validators.required),
      relationshipId: new FormControl(this.userData.relationshipId, Validators.required),
      genId: new FormControl(this.userData.genId, Validators.required),
      maritalStatusId: new FormControl(this.userData.maritalStatusId, Validators.required),
      gender: new FormControl(this.userData.gender, Validators.required),
      relation: new FormControl(this.userData.relation, Validators.required),
      dateOfBirth: new FormControl(this.userData.dateOfBirth, Validators.required),
      pan: new FormControl(this.userData.pan, Validators.required),
      adharNo: new FormControl(this.userData.adharNo, Validators.required),
      janAdharId: new FormControl(this.userData.janAdharId, Validators.required),
      mobNo: new FormControl(this.userData.mobNo, Validators.required),
      employeed: new FormControl(this.userData.employeed, Validators.required),
      disable: new FormControl(this.userData.disable, Validators.required),
      disabilityPercentage: new FormControl(this.userData.disabilityPercentage, Validators.required),
      address: new FormControl(this.userData.address, Validators.required),
      ssoId: new FormControl(this.userData.ssoId, Validators.required),
      nationality: new FormControl(this.userData.nationality, Validators.required),
      maritalStatus: new FormControl(this.userData.maritalStatus, Validators.required),

    });
  }

  onSubmitCertificateDetails() {
    console.log("Familly Details Form Data last===>>>", this.familyDtlForm.value);
    var url = this.apiurl.url.updatefamilydetails;
    var data = {
      "familyMemberId": this.familyDtlForm.controls['familyMemberId'].value,
      "pensionerId": this.familyDtlForm.controls['pensionerId'].value,
      "relationshipId": this.familyDtlForm.controls['relationshipId'].value,
      "genId": this.familyDtlForm.controls['genId'].value,
      "maritalStatusId": this.familyDtlForm.controls['maritalStatusId'].value,
      "dateOfBirth": this.familyDtlForm.controls['dateOfBirth'].value,
      "pan": this.familyDtlForm.controls['pan'].value,
      "employeed": this.familyDtlForm.controls['employeed'].value,
      "disable": this.familyDtlForm.controls['disable'].value,
      "disabilityPercentage": this.familyDtlForm.controls['disabilityPercentage'].value
    };
    console.log("JSON for family Ditails update", data)
    this.api.postpension(url, data).subscribe((res: any) => {
      console.log("result>>>", res);
      if (res.data) {
        alert(res.data);
      }
    })
    this.familyDtlForm.disable();

    return false;
  }
  SubmitCertificateDetails() {
    this.verifyMobileNo();
    return false;
  }



  verifyMobileNo(): void {
    if (this.familyDtlForm.getRawValue().mobNo) {
      let data = {
        "ssoId": "RJ121212",
        "sourceId": "1",
        "processId": "18",
        "mobileNo": this.familyDtlForm.getRawValue().mobNo,
        "ipAddress": "10.1.1.1"
      }
      this.apiService.postIfms('otp/otpGenerate', data).subscribe({
        next: res => {
          console.log("otp res data >>", res)
          this.verifyOtp(res);
        }
      })
    }
    else {
      alert("The Employee mobile number was not found");
    }
  }



  verifyOtp(res: any) {
    const confirmDialog = this.dialog.open(CommonDialogueBoxComponent, {
      autoFocus: false,
      width: '350px',
      data: {
        action: '',
        id: 'otp',
        otpData: res,
        mobileNo: this.familyDtlForm.getRawValue().mobNo
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      console.log("data", data);

      if (data.verified === 'Y') {
        this.onSubmitCertificateDetails();
      } else {
        alert("The OTP (One-Time Password) was not verified")
      }
    })
  }



  okButton(event: any) {
    this.data.getEventStatus(event);
    if (event == 'ok') {
      this.router.navigate(['/Status']);
      this.dialogRef.close();
      this.isVisible = true;
    }
  }

  onClose(): void {
    // You can perform any actions needed before closing the dialog
    console.log('Closing the dialog...');
    // Close the dialog
    this.dialogRef.close();
  }


  otpChange() {
    if (this.otp.length != 6) {
      alert("Please enter a valid OTP (One-Time Password). The OTP you entered is incorrect");
      this.otp = ""
    }
  }
  checkOtp(action: any) {
    console.log('otpData', this.otpData)
    let data = {
      "ssoId": "RJ121212",
      "sourceId": "1",
      "processId": "18",
      "mobileNo": this.mobNo,
      "reqId": this.otpData.reqId,
      "otpCode": this.otp,
      "otpEnv": "T"
    }
    console.log("data", data);
    this.apiService.postIfms('otp/otpVerify', data).subscribe({
      next: res => {
        console.log(res)
        this.dialogRef.close(res);
      }
    })
  }
}











