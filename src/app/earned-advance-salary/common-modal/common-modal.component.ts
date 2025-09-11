import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from 'src/app/services/loader.service';
import { DatashareService } from 'src/app/services/datashare.service';
import { AppConfig } from 'src/app/app.config';


@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss'],
})

export class CommonModalComponent implements OnInit {
  otpForm: any;
  message: any;
  id: any;
  action: any;
  receivedData: any;
  bankName: any;
  fsProvider: any;
  aadharRefNo: any;
  deptName: any;
  employeeCode: any;
  phoneNo: any;
  emailId: any;
  sourceId: any;
  processId: any;
  agenctsrvcId: any;
  reqID: any;
  ssoId: any;
 
  currentAvailableSalarydata:any;
  checkboxError:boolean = false;
  checkboxChecked:boolean = false;
  showRedirectionMsg:boolean = false;
  showRedirectionKycMsg:boolean = true;
  referenceId: any;
  mobileNo:any
  actionType: any;
  tranStatus: any;
  tncData:any;
  transactionDataSource:any;
  // transactionCharge:[]=[];
  displayedColumnsTransactionFee: string[] = ['amount_given','transaction_fee'];
  consentSource:any;
  currentDate:any;
  userType:any;
  dialogText:any;
  imageData:any;
  showPreviewMsg:boolean = false;
  reason:any;



  @ViewChild('otpInput1') otpInput1: MatInput;
  @ViewChild('otpInput2') otpInput2: MatInput;
  @ViewChild('otpInput3') otpInput3: MatInput;
  @ViewChild('otpInput4') otpInput4: MatInput;
  @ViewChild('otpInput5') otpInput5: MatInput;
  @ViewChild('otpInput6') otpInput6: MatInput;

  consentDetails: any;
  employeeId: any;
  empName: any;
  agentName: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private dataShareService: DatashareService,
    private dialogRef: MatDialogRef<CommonModalComponent>,
    private dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: SnackbarService,
    private router:Router,
    private load:LoaderService,
    // private dashboard:DashboardComponent
  ) {
    /* this.message = data.message;
    this.id = data.id; */
    console.log("data",this.data)
    this.id = data.id;
    this.action = data.action;
    this.bankName = data.bankName;
    this.fsProvider = data.fsProvider;
    this.aadharRefNo = data.aadharRefNo;
    this.deptName = data.deptName;
    this.employeeCode = data.employeeCode;
    this.phoneNo = data.mobileNo;
    this.emailId = data.emailId;
    this.sourceId = data.sourceId;
    this.agenctsrvcId = data.agenctsrvcId;
    this.processId = data.processId;
    this.currentAvailableSalarydata = data.currentAvailableSalarydata;
    this.referenceId = data.referenceId;
    this.employeeId=data.empId;
    this.empName=data.empName;
    this.agentName=data.agentName;
    this.actionType=data.actionType;
    this.tranStatus=data.tranStatus;
    this.tncData = data.tncData;
    this.consentSource = data.consentSource;
    this.currentDate = data.currentDate;
    this.userType = data.userType;
    this.dialogText = data.dialogText;
    this.imageData = data.imageData;
    this.reason=data.reason;



  }
  pensionerData:any;
  config:AppConfig=new AppConfig();

  ngOnInit(): void {
    let details = sessionStorage.getItem('userDetails');
    let consentDetails:any=sessionStorage.getItem('empConsentDetails')
    if(consentDetails!='undefined'){
      this.consentDetails=JSON.parse(consentDetails);
      console.log("data",this.consentDetails)
    }

    if(details)
      {
        let data=JSON.parse(this.config.decrypt(details))
        this.pensionerData=data[0]
      }
    console.log("pensionerData",this.pensionerData)
    this.startTimer();
    this.otpForm = this.formbuilder.group({
      otpInput1: ['', Validators.required],
      otpInput2: ['', Validators.required],
      otpInput3: ['', Validators.required],
      otpInput4: ['', Validators.required],
      otpInput5: ['', Validators.required],
      otpInput6: ['', Validators.required],
    });
    this.ssoId = this.dataShareService.dataEmitted.ssoId;
    console.log("this.agenctsrvcId",this.agenctsrvcId);

    this.getMaskedPhoneNo(this.data.mobileNo);
    // this.transactionCharge=this.tncData;
    // this.ssoId = this.dataShareService.dataEmitted[0].ssoId;
    // this.phoneNo = this.dataShareService.dataEmitted[1].phoneNo;
    // this.apiService.consentDetailsCast.subscribe((res:any)=>{
    //   this.consentDetails = res;
    // });

    this.consentDetails = JSON.parse(sessionStorage.getItem('empConsentDetails')!);

    this.transactionDataSource = new MatTableDataSource(this.tncData);
  }

  submit = () => {
    this.dialogRef.close();
  };

  closeDialog() {
    this.dialogRef.close();
  }

  referData(action: any) {
    if (action === 'verify-via-otp') {
      this.dialogRef.close(action);
      // console.log(action);
    } else if ('verify-otp') {
      const otpString = Object.values(this.otpForm.value).join('');
      // console.log('otp Filled', otpString);
      this.dialogRef.close(otpString);
    }

  }


  

  resendClickCounter: number = 1; // Counter variable for resend button clicks
  resendOtp() {
    this.otpForm.reset();
    if (this.resendClickCounter <= 3) {
      clearInterval(this.timerInterval); // Clear the previous timer interval
      this.remainingMinutes = 0; // Reset the timer values
      this.remainingSeconds = 59;

      // this.ssoId = this.dataShareService.dataEmitted[0].ssoId;
      // this.phoneNo = this.dataShareService.dataEmitted[1].phoneNo;

      let requestData = {
        ssoId: this.ssoId,
        sourceId: this.sourceId,
        processId: this.processId,
        mobileNo: this.phoneNo,
        ipAddress: '0.0.0.0',
      };
      this.load.show();
      this.apiService.postOr('otp/otpGenerate', requestData).subscribe({
        next: (res:any) => {
          this.load.hide();
          this.receivedData = res;
          console.log('received data ==>', this.receivedData);
          this.reqID = this.receivedData.reqId;
          console.log('RequestId', this.reqID);
          const reqIdData = { reqId: this.reqID };
          this.dataShareService.dataEmitted.splice(2, 1);
          this.dataShareService.setData(reqIdData);

          this.resendClickCounter++; // Increment the resend button click counter

          if (this.resendClickCounter >= 3) {
            let showResendText = true;
            // Check if the maximum limit is reached
            this.showResendButton = false; // Hide the Resend OTP button
          }
        },
      });

      console.log(this.reqID);
      if (this.resendClickCounter <= 3) {
        this.showResendButton = false; // Hide the Resend OTP button during API call
        this.startTimer(); // Start the timer if the maximum limit is not reached
      }
    }
  }

  saveConsentObject: any;
  verifyOtp() {
    if (this.otpForm.invalid) {
      return;
    }
    const otpString = Object.values(this.otpForm.value).join('');
    console.log('otp Filled', otpString);

    this.reqID = this.dataShareService.dataEmitted[2].reqId;

    let requestDataVerify = {
      ssoId: this.ssoId,
      sourceId: this.sourceId, ////getEmployeeEarnedAdvanceSalaryConsent
      processId: this.processId, //getEmployeeEarnedAdvanceSalaryConsent
      mobileNo: '9414042502', //getEmployeeEarnedAdvanceSalaryConsent
      reqId: this.reqID, //response of otp/otpGenerate
      otpCode: otpString,
      otpEnv: 'T', // for now its "T" but will received going forward through environment
    };
    this.load.show();
    this.apiService
      .postOr('otp/otpVerify', requestDataVerify)
      .subscribe((res:any) => {
        this.load.hide();
        console.log('api response', res);
        if (res?.status == 'S') {
          this.saveConsentObject = JSON.parse(
            localStorage.getItem('consentDetails')!
          );
          console.log('consent', this.saveConsentObject);
          this.saveEarnedAdvanceSalaryUndertaking();
          this.closeDialog();
          this.dialog.open(CommonModalComponent, {
            autoFocus: false,
            disableClose: true,
            width: '',
            data: {
              action: '',
              id: 'confirm-otp',
            },
          });
        } else {
          this.snackBar.show(res?.error?.description, 'danger');
        }
      });
  }

  saveEarnedAdvanceSalaryUndertaking = () => {
    this.apiService
      .postMst('saveEarnedAdvanceSalaryUndertaking', this.saveConsentObject)
      .subscribe({
        next: (res:any) => {
          console.log('~~~>>', res);
        },
      });
  };

  onOtpKeyUp(event: KeyboardEvent,nextInput: HTMLInputElement | null,previousInput: HTMLInputElement | null,maxLength: number) {
    const input = event.target as HTMLInputElement;
    const key = event.key;

    if (key === 'Backspace' && previousInput) {
      // previousInput = input.previousElementSibling as HTMLInputElement;
      previousInput.focus();
      if (previousInput) {
        this.otpForm.get(previousInput).addValidators([Validators.required]);
        previousInput.value = '';
      }
    } else if (input.value.length === maxLength && nextInput) {
      nextInput.focus();
    }
  }

  remainingMinutes: number = 0;
  remainingSeconds: number = 59;
  showResendButton: boolean = false; // Flag variable to show/hide the Resend OTP button
  timerInterval: any; // Variable to store the interval

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else if (this.remainingMinutes > 0) {
        this.remainingMinutes--;
        this.remainingSeconds = 59;
      } else {
        clearInterval(this.timerInterval);
        this.showResendButton = true; // Set the flag variable to true when the timer reaches 0
      }
    }, 1000);
  }

  // Call the startTimer() method to start the timer

  maskedPhoneNo: any;
  getMaskedPhoneNo(phoneNo: any) {
    console.log('PlainPhoneNo', phoneNo);
    if (phoneNo) {
      let maskedDigits = phoneNo.slice(0, -4).replace(/./g, '*');
      let lastDigits = phoneNo.slice(-4);
      this.maskedPhoneNo = maskedDigits + lastDigits;
      return this.maskedPhoneNo;
      console.log("mobile",this.maskedPhoneNo);
    } else {
      return '';
    }
  }
  // maskedMobileNo: any;
  // getMaskedMobileNo(mobileNo: any) {
  //   if (mobileNo) {
  //     let maskedDigits = mobileNo.slice(0, -4).replace(/./g, '*');
  //     let lastDigits = mobileNo.slice(-4);
  //     this.maskedMobileNo = maskedDigits + lastDigits;
  //     console.log("mobile",this.maskedMobileNo);
  //   } else {
  //     console.log("Invalid phone number");
  //   }
  // }
  // proceed to withdraw advance salary

  proceedToWithdraw(){



    this.showRedirectionMsg = false;
    if(this.checkboxChecked){
      this.checkboxError = false;
      //setTimeout(() => {
        let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
        let payload = {
          "actionType": "WTH",
          "mobileNo": this.consentDetails?.psndtl?.phoneNo || null,
          "empId": sendData || null,
          "amnt": this.currentAvailableSalarydata?.wAmt,
          "srvcAgentId": this.consentDetails?.consentDtl?.agentId || null,

      }
        this.redirectionToServiceProviderApi(payload);


        //location.href = `${location.origin}/#/ess/service-provider-website-component`;
      //}, 1000);
    } else {
      this.checkboxError = true;
    }
  }
  getAmount(i:any,j:any)
  {
 
      return Number(i)-Number(j);
   
  }
  redirectionToServiceProviderApi(payload:any){

    this.load.show();

    this.showRedirectionMsg = true;

    this.apiService
        .pension(payload,'getAdvancePensionExternalRedirect')
        .subscribe((res:any)=>{
          console.log('SResponse->>>>>', res);
          if(res.data){
            location.href = res.data.redirectUrl;
          } else {
            this.load.hide();
            // this.cd.openErrorModal('Something went wrong, please try after sometime', null, ()=>{
            //   this.showRedirectionMsg = false;
            // });
          }

        },
        err=>{
            this.load.hide();
            // this.cd.openErrorModal('Something went wrong, please try after sometime', null, ()=>{
            //   this.showRedirectionMsg = false;
            // });
        }
        );
  }
// a
  goToDashboard(){
    if(this.tranStatus!=='Success' && this.actionType ==='KYC'){
      this.router.navigate(['/MyDashboard']);
    } else {
      this.router.navigate(['/MyDashboard']);
    }

  }

  onCheck(ob: MatCheckboxChange){
    if(ob.checked){
      this.checkboxChecked = true;
    } else {
      this.checkboxChecked = false;
    }

  }

  check = (action:any) => {
    this.dialogRef.close(action);
    if(action=='Y'){
      // this.dialog.open(CommonModalComponent,{
      //   autoFocus: false,
      //   disableClose: true,
      //   width: '',
      //   data: {

      //     id: 'successfull'
      //   },
      // })
      // this.sendOtpData();
    }

    if(action=='otp'){
      const otpString = Object.values(this.otpForm.value).join('');
    console.log('otp Filled', otpString);
    this.dialogRef.close(otpString)
    }

  };

  redirectHome(){
    this.router.navigate(['./MyDashboard']);
    
}

downloadFromBase64(){
  const linkSource = `data:application/octet-stream;base64,${this.imageData.imageData}`;
  const downloadLink = document.createElement('a');
  const fileName = this.imageData.docName;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
// completeKYC(){
//   let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
//   let payload = {
//     "actionType": "WTH",
//     "mobileNo":Number(this.pensionerData?.mobileNumber) || null,
//     "empId": sendData,
//     "amnt": 0,
//     "srvcAgentId": this.consentDetails?.consentDtl?.agentId || null,
// }
completeKYC(){
  let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
  let payload = {
    "actionType": "KYC",
    "mobileNo":Number(this.pensionerData?.mobileNumber) || null,
    "empId": sendData,
    "amnt": 0,
    "srvcAgentId": this.consentDetails?.consentDtl?.agentId || null,
}


this.redirectionToServiceProviderApi(payload)

}

redirectDashboard(){
  this.router.navigate(['./MyDashboard']);

}
}

const transactionCharge: any[] = [
  {
    amount_given: 'Rs. 0-300',
    transaction_fee: 'Rs. 9/-',
  },
  {
    amount_given: 'Rs. 301-1000',
    transaction_fee: 'Rs. 19/-',
  },
  {
    amount_given: 'Rs. 1001-3000',
    transaction_fee: 'Rs. 49/-',
  },
  {
    amount_given: 'Rs. 3001-5000',
    transaction_fee: 'Rs. 69/-',
  },
  {
    amount_given: 'Rs. 5001-10000',
    transaction_fee: 'Rs. 99/-',
  },
  {
    amount_given: 'Rs. 10001-20000',
    transaction_fee: 'Rs. 199/-',
  },
];
