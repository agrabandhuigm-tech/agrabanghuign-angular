import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


import { Subject } from 'rxjs';
import { CommonModalComponent } from './common-modal/common-modal.component';

import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DatashareService } from '../services/datashare.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AppConfig } from '../app.config';
import { LoaderService } from '../services/loader.service';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-earned-advance-salary',
  templateUrl: './earned-advance-salary.component.html',
  styleUrls: ['./earned-advance-salary.component.scss']
})
export class EarnedAdvanceSalaryComponent implements OnInit {
  pension_2_0:boolean=false;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    nav: true,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    navText: ["<img src='./assets/images/left-arrow.svg' alt='Previous'>", "<img src='./assets/images/right-arrow.svg'  alt='Next'>"],
    responsive: {
      0: {
        items: 1,
      },
      200: {
        items: 1,
      },
      400: {
        items: 1,
      },
      550: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },

  }
  
  showSalaryDetails = false;
  selectedProvider: any;
  hideSelectBtn: boolean = false;
  chooseProvider: any;
  notification: boolean = true;
  lastSalaryDetails: any = {};
  earnedSalaryDetails: any;
  serviceProvider: any = {};
  empConsentDetails: any;
  user: any = {};
  bankName: any;
  isProviderSelected: boolean = false;
  showconsent = false;
  selectedCard: any;
  isView: boolean = false;
  viewClicked: string = '';
  saveConsentData: any;
  saveEarnedAdvanceSalaryUndertaking: any;
  changeServiceProvider: any;
  otpReceivedData: any;
  consentSource: any;
  showdetails:string="";
  tncData: any;
  fromServiceProvider:boolean = false;
  fromServiceProviderCB:any;
  agnSrvcId: any;
pensionerData:any;
ppoNo:any;
accountNo:any;


  // private data = new Subject<any>();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CommonModalComponent>,
    private apiService: ApiService,
    private dataShareService: DatashareService,
    
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private snackBar: SnackbarService,
    private load:LoaderService,
    @Inject(DOCUMENT)
    private document: Document
  ) { }
  config:AppConfig=new AppConfig()
  ngOnInit(): void {
    this.apiService.configMenu = { IsShow: true };
    let details = sessionStorage.getItem('userDetails');
    if(details)
      {
        let data=JSON.parse(this.config.decrypt(details))
        this.pensionerData=data[0]
      }
    console.log("pensionerData",this.pensionerData)
    if(sessionStorage.getItem('urlFromPension')){
      this.fromServiceProvider = true;
      this.fromServiceProvider = false;
    }

    this.fromServiceProviderCB  = sessionStorage.getItem('callbackUrl');


    this.user = this.apiService.userInfo();
    console.log("user info", this.user);
    // this.dataShareService.getData(this.user.ssoId);
    const ssoIdData = { ssoId: this.user?.ssoId };
  
    if(ssoIdData.ssoId!==undefined)
    {
      this.dataShareService.setData(ssoIdData);

     
      // this.getServiceProvider();
  
     
      this.getLastSalaryDetails();
      // this.getSaveEarnedAdvanceSalaryUndertaking();
    }else
    {
      this.pension_2_0=true;
      this.notification=false;
    }
  
    this.getEarnedSalaryAdvOptions();


  }

  pension_2_0_data:any;
  onSearch()
  {
    if(!this.ppoNo)
    {
      this.snackBar.show('Enter PPO No', 'danger');
      return;
    }
    if(!this.accountNo)
      {
        this.snackBar.show('Enter Account No', 'danger');
        return;
      }
    if(this.ppoNo && this.accountNo)
    {
      let data={
        "ppoId":this.ppoNo+'-'+this.accountNo
      }
      this.load.show();
      this.apiService
      .pension( data,'getBasicInfo')
      .subscribe({
        next: (res:any) => {
          this.load.hide();
          console.log("2.0 data",res);
          if(res.data.length>0)
          {
            console.log("this.ppoNo",this.ppoNo);
            this.pension_2_0_data=res.data[0];
            this.pensionerData={};
            this.pensionerData['ppoNo']=this.ppoNo;
            this.pensionerData['accNo']=this.accountNo;
            this.pensionerData['employeeCode']=this.pension_2_0_data?.emcode?this.pension_2_0_data?.emcode:this.pension_2_0_data?.employeeid;
            this.pensionerData['mobileNumber']=this.pension_2_0_data?.mobno;
            this.pensionerData['email']=this.pension_2_0_data?.email;
            this.pensionerData['pension_2_0']=this.pension_2_0;
            this.notification=true;
            this.getLastSalaryDetails();
          }else
          {
            this.snackBar.show('Data not found.', 'danger');
          }
         
        }});
    }
  }
  onReset()
  {
this.ppoNo=null;
this.accountNo=null;
  }
  getServiceProvider = () => {
    this.load.show();
    this.apiService
      .postlmdm('getServiceBankAdvanceSalary', { serviceTypeId: this.agnSrvcId })
      .subscribe({
        next: (res:any) => {
          this.load.hide();
          res.data.forEach((provider: any) => {
            this.serviceProvider = provider;
            console.log('serviceProvider',this.serviceProvider); // Access each provider object here
          });
        },
      });
  };


  getLastSalaryDetails() {
 
    let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
    this.load.show();
    this.apiService
      .pension( {
        ppoId: sendData
      
      },'getCurrentAvailablePension')
      .subscribe({
        next: (res:any) => {
          this.load.hide();
          this.getEmployeeEarnedAdvanceSalaryConsent()
          this.lastSalaryDetails =JSON.parse(res.data);
          console.log('Last pension Details', this.lastSalaryDetails);
          // this.getSaveEarnedAdvanceSalaryUndertaking();
       
          let consentDetails = {
            ...this.lastSalaryDetails,
            utFlag: 'Y',
            utDt: null,
            hodApprvd: 'N',
            hodApprvdDt: null,
            hodApprvdBy: null,
            source: null,
            svcAgencyId: this.agnSrvcId,
          };

          localStorage.setItem(
            'consentDetails',
            JSON.stringify(consentDetails)
          );
        },
      });
  }


  getSaveEarnedAdvanceSalaryUndertaking() {
    // console.log('this.lastSalaryDetails.payMonth',this.lastSalaryDetails.payMonth);
   
    let reqData = {
      empId: this.lastSalaryDetails.empId,
      utFlag: 'Y',
      utDt: '',
      payMonth: this.lastSalaryDetails.payMonth,
      payYear: this.lastSalaryDetails.payYear,
      grossAmnt: this.lastSalaryDetails.grossAmnt,
      netAmnt: this.lastSalaryDetails.netAmnt,
      svcAgencyId: this.agnSrvcId,
      hodApprvd: 'N',
      hodApprvdDt: null,
      hodApprvdBy: null,
      agencyKycStatus: 'Y',
      source:  this.consentSource || 'IFMS',
      mobileNo:  this.pensionerData?.mobileNumber,
      pensionerId:  this.pension_2_0?this.ppoNo:this.pensionerData?.pensionerId,
      ppoNo:  this.pensionerData?.ppoNo

    };
    console.log('reqData', reqData);
    this.load.show();
    this.apiService
    .pension( reqData,'saveAdvancePensionUnderTaking')
      .subscribe({
        next: (res:any) => {
          this.saveEarnedAdvanceSalaryUndertaking = res.data;
          console.log('~~>>', this.saveEarnedAdvanceSalaryUndertaking);
          if (JSON.stringify(res).includes("utReqId")) {
            let reqData2={
              "ppoNo":this.pensionerData?.ppoNo,
              "agentKycStatus":"N",
              "srvcAgentId":this.agnSrvcId,
              "mobNo":this.pensionerData?.mobileNumber,
              "accNo":this.pensionerData?.accNo.slice(-4),
              "reqIpAddress":" ",
              "rqstDt":new Date(),
              "pensionerId":this.pensionerData?.pensionerId
            }
            this.apiService
            .pension( reqData2,'consentData')
              .subscribe({
                next: (res:any) => {
                  this.load.hide();
                  if (JSON.stringify(res).includes("utReqId")) {
                    this.dialog.open(CommonModalComponent, {
                      autoFocus: false,
                      disableClose: true,
                      width: '',
        
                      data: {
                        action: '',
                        consentSource: (this.consentSource === 'IFMS' || !this.consentSource) ? 'IFMS' : this.consentSource,
                        id: 'confirm-otp',
                      },
                    });
        
                    if(this.consentSource === 'IFMS' || !this.consentSource){
                      setTimeout(() => {
                        this.externalredirect();
                        // this.redirectToRefyne(this.agnSrvcId)
                      }, 2000);
        
                    } else {
        
                      if(this.fromServiceProviderCB){
                        setTimeout(() => {
                          location.href = this.fromServiceProviderCB;
                        }, 2000);
        
                      }
        
                    }

                  }else{
                    this.snackBar.show('Something went wrong', 'danger');
                  }
                
                },
                error:(err)=>{
                  this.snackBar.show(err?.error?.description || 'Something went wrong', 'danger');
                }
              });
         


          } else {
            this.snackBar.show(res?.error?.description, 'danger');
          }
        },
        error:(err)=>{
          this.load.hide();
          this.snackBar.show(err?.error?.description || 'Something went wrong', 'danger');
        }
      });
  }
// a
  additionalDetails: any;
  paramsDetail: any;
  providersArray: any = [];
  getEarnedSalaryAdvOptions = () => {
    this.load.show();
    this.apiService
    .pension( {
      inType: 1,
    },'getAdvancePension')
      .subscribe({
        next: (res:any) => {
          this.load.hide();
          this.earnedSalaryDetails = res.data;
          console.log('earnedSalaryDetails', this.earnedSalaryDetails);

          let providers = this.earnedSalaryDetails.providers;
          this.providersArray = this.earnedSalaryDetails.providers;
          console.log('this.providersArray', this.providersArray);

          providers.forEach((provider: { addtlDetails: any }) => {
            let addtlDetails = provider.addtlDetails;
            addtlDetails.forEach((detail: { params: any }) => {
              this.additionalDetails = provider.addtlDetails;
            });
          });
          //param
          providers.forEach((provider: { param: any }, i:number) => {
            let param = provider.param;
            param.forEach((detail: { params: any }) => {

              this.paramsDetail = provider.param;
            });
          });
       
        },
      });
   };

  sortTermsCondition(tnc:any){
    let tncArr = [...tnc];
    tncArr.sort((a,b)=>a.index-b.index);
    return tncArr
  }

  getSafeImageUrl(base64String: string) {
    const imageUrl = 'data:image/png;base64,' + base64String;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }




  aadharRefNo: any;
  deptName: any;
  employeeCode: any;
  phoneNo: any;
  emailId: any;
  sourceId: any;
  processId: any;
  counterCall:any=0;


  saveConsentObject: any;
  getEmployeeEarnedAdvanceSalaryConsent = () => {

    let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
   
    this.saveConsentObject = JSON.parse(
      localStorage.getItem('consentDetails')!
    );
    console.log('consent', this.saveConsentObject);
    this.load.show();
    this.apiService
      .pension({
         ppoId: sendData
      },'getConsentStatus' )
      .subscribe({
        next: (res:any) => {
          this.load.hide();
          if(res.status===500 && this.counterCall<4){

            this.counterCall++;
            setTimeout(() => {

              this.getEmployeeEarnedAdvanceSalaryConsent();
            }, 1500);

          }
        
          this.empConsentDetails = res;
          console.log("consentStatus", this.empConsentDetails)
          if(this.empConsentDetails.consentDtl){
           
            this.showSalaryDetails=true;
            
          }
          // console.log('****>', this.empConsentDetails);
          this.aadharRefNo = this.empConsentDetails.psndtl.aadharRefNo;
          this.deptName = this.empConsentDetails.psndtl.deptName;
          this.employeeCode = this.empConsentDetails.psndtl.employeeCode;
          this.phoneNo = this.empConsentDetails.psndtl.phoneNo;
          this.emailId = this.empConsentDetails.psndtl.emailId;
          this.sourceId = this.empConsentDetails.sourceId;
          this.processId = this.empConsentDetails.processId;
          this.consentSource = this.empConsentDetails.consentDtl.source;

          // console.log('this.consentSource', this.consentSource);
          //"IFMS";
        },
        error: (err)=> {
          this.load.hide();
            if(this.counterCall<4)
            {
            this.counterCall++;
            setTimeout(() => {

              this.getEmployeeEarnedAdvanceSalaryConsent();
            }, 1500);

        }
        },
      });
  };

  
  verifyUndertaking(agenctsrvcId:any) {
    this.selectedProvider = true;
    this.hideSelectBtn = false;
    this.notification = false;
    this.chooseProvider = true;
    this.showSalaryDetails = false;
    this.showconsent = true;
    this.agnSrvcId=agenctsrvcId;

    let currentDate = new Date();

let data={
  empName: this.pension_2_0?this.pension_2_0_data?.fname:this.user.displayName,
  bankName: this.bankName,
  fsProvider: this.earnedSalaryDetails?.fsProvider,
  aadharRefNo: this.aadharRefNo,
  deptName: this.pensionerData?.parentDepartment,
  employeeCode: this.pensionerData?.employeeCode,
  pensionerId: this.pension_2_0?this.ppoNo:this.pensionerData?.pensionerId,
  mobileNo: this.pensionerData?.mobileNumber,
  emailId: this.pensionerData?.email,
  sourceId: this.sourceId?this.sourceId:0,
  processId: this.processId?this.processId:0,
  agenctsrvcId: agenctsrvcId,
  currentDate: currentDate,
  ppoNo: this.pensionerData.ppoNo,
  action: '',
  id: 'verify-undertaking'
}
console.log("data",data)

    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      disableClose: true,
      width: '',
      data: data,
    });

    confirmDialog.afterClosed().subscribe((data) => {
      if (data === 'verify-via-otp') {
        // this.onsubmit();
        this.sendOtpData();
        // this.getSaveEarnedAdvanceSalaryUndertaking();
      }
    })
  }
  toggleSelected(earnedSalary: any, bName: any) {
    this.isView = false;
    // this.isProviderSelected = true;
    earnedSalary.selected = !earnedSalary.selected;
    // console.log("event triggered", bName);
    this.bankName = bName;

    if (this.selectedCard === earnedSalary) {
      // If the same card is clicked again, deselect it
      this.selectedCard = null;
      earnedSalary.selected = false;
    } else {
      // Select the clicked card and deselect the previously selected card
      if (this.selectedCard) {
        this.selectedCard.selected = false;
      }
      this.selectedCard = earnedSalary;
      earnedSalary.selected = true;
    }
    this.isViewClicked(this.bankName);
  }



  changeService() {
    this.selectedProvider = true;
    this.changeServiceProvider = false;
    this.notification = false
  }

  chooseService() {
    this.selectedProvider = true;
    this.notification = false;
    this.showSalaryDetails = false;

  }

  // checkBoxSelection(){
  //   this.isCheckboxSelected = !this.isCheckboxSelected;
  // }


  isViewClicked(earnedSalaryName: string) {

    this.viewClicked = earnedSalaryName;


    console.log("check value",this.showdetails);

    // this.isView = true;
  }


  sendOtpData() {
    let requestData = {
    "ssoId": this.user?.ssoId?this.user?.ssoId:'',
    "sourceId":"1",
    "processId":"18",
      "mobileNo": this.pensionerData?.mobileNumber,
      // "mobileNo": 9462624610,
      "ipAddress":"10.1.1.1"
    };
    
this.load.show();
    this.apiService.postOr('otp/otpGenerate', requestData).subscribe({
      next: (res:any) => {
        this.load.hide();
        this.otpReceivedData = res;
        // console.log('recieved data ==>', this.otpReceivedData);
        console.log('RquestId', this.otpReceivedData.reqId);
        const reqIdData = { reqId: this.otpReceivedData.reqId };
        this.dataShareService.setData(reqIdData);
        if (this.otpReceivedData.responseCode) {
          const confirmDialog = this.dialog.open(CommonModalComponent, {
            autoFocus: false,
            disableClose: true,
            width: '',
            data: {
              sourceId: 1,
              processId: 10,
              mobileNo: this.pensionerData?.mobileNumber,
              requestId: this.otpReceivedData.reqId,
              action: '',
              id: 'otp',
            },
          });
          confirmDialog.afterClosed().subscribe(data => {
            if (data) {
              this.verifyOtp(data);
            }
          })
        }
      },
    });
  }

  // saveConsentObject: any;
  verifyOtp(data: any) {
    // console.log('VerifyOTTTPPP', data);
    const otpString = data;

    let requestDataVerify = {
      ssoId: this.user?.ssoId?this.user?.ssoId:'',
      sourceId: this.sourceId, ////getEmployeeEarnedAdvanceSalaryConsent
      processId: this.processId, //getEmployeeEarnedAdvanceSalaryConsent
      mobileNo: this.phoneNo, //getEmployeeEarnedAdvanceSalaryConsent
      reqId: this.dataShareService.dataEmitted.reqId, //response of otp/otpGenerate
      otpCode: otpString,
      otpEnv: 'T', // for now its "T" but will received going forward through environment
    };
    this.load.show();
    this.apiService
      .postOr('otp/otpVerify', requestDataVerify)
      .subscribe((res:any) => {
        this.load.hide();
        console.log('api response', res);
        
        if (res.status === 'S') {
          // this.saveConsentObject = JSON.parse(
          //   localStorage.getItem('consentDetails')!
          // );
          // console.log('consent', this.saveConsentObject);
          
          // this.saveEarnedAdvanceSalaryUndertaking();
          // this.closeDialog();
          // setTimeout(() => {
          //   this.routers.navigate(['./ess/earned-advance-salary/'])

          // }, 2500);
          console.log('this.consentSource after save API', this.consentSource);
          this.getSaveEarnedAdvanceSalaryUndertaking();

        } else {
          this.load.hide();
          this.snackBar.show(res?.errMsg, 'danger');
          setTimeout(() => {
            // this.routers.navigate(['./ess/earned-advance-salary/'])

          }, 2500);

        }
      });
  }

  externalredirect(){
 
  let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
let payload={
  
    "actionType": "KYC",
    "tranId":"",
    "mobileNo": Number(this.pensionerData?.mobileNumber) || null,
    // "mobileNo": 9462624610,
    "empId": sendData,
    "srvcAgentId":Number(this.agnSrvcId),
    "amnt":0

}
this.load.show();
  this.apiService
        .pension(payload,'getAdvancePensionExternalRedirect')
        .subscribe((res:any)=>{
          this.load.hide();
          console.log('SResponse->>>>>', res);
          location.href = res.data.redirectUrl;
          //location.href = "https://app.refyne.co.in/#/loginRegister";
         
        },
        err=>{
          this.load.hide();
        }
        );


  }

  checkExternalconsent(){
    if(this.consentSource==='AGENT'){
      const confirmDialog = this.dialog.open(CommonModalComponent, {
        autoFocus: false,
        disableClose: true,
        //width: '60%',
        panelClass:'medium-dialog',
        data: {
          empId: this.lastSalaryDetails.empId,
          empName: this.user.displayName,
          mobileNo: this.empConsentDetails.empdtl.phoneNo,
          agentName: this.empConsentDetails.consentDtl.agentName,
          // emailId: this.empConsentDetails.empdtl.emailId,
          action: '',
          id: 'svcPrvdr',
        },
      });
      confirmDialog.afterClosed().subscribe((data) => {
        if (data === 'verify-via-otp') {
          this.sendOtpData();
        }
      })
    } else {

      const confirmDialog = this.dialog.open(CommonModalComponent, {
        autoFocus: false,
        disableClose: true,
        // width: '40%',
        // height:'20%',
        panelClass:'small-dialog',
        data: {
          desc: '',
          id: 'no-record-found',
        },
      });
      confirmDialog.afterClosed().subscribe((data) => {

      })
    }
  }

  tnc(providerId:any){

    let payload = {
      "srvcAgentId":providerId,
      "flag": 6,
  }
  this.apiService
  .pension( payload,'getConsentEmployeeList')
    .subscribe({
      next: (res:any) => {
  if(JSON.stringify(res).includes("amntRange"))
  {
    console.log("transDtls",res.data.transDtls)
    this.tncData=res.data.transDtls;
    if(this.tncData){
      this.dialog.open(CommonModalComponent, {
        autoFocus: false,
        disableClose: true,
        width: '60%',
        data: {
          tncData:this.tncData,
          id: 'trnsctionChargeDetails',
        },
      });
    }
  }
       

          //location.href = "https://app.refyne.co.in/#/loginRegister";
        },
      });


    // console.log("providerName",providerName);

  }

  toggleViewMore(serviceAgentName:any){


    if(this.showdetails === serviceAgentName){
      this.showdetails = '';
    } else {
      this.showdetails = serviceAgentName;
    }
    //this.showdetails=!this.showdetails;
  }
}
