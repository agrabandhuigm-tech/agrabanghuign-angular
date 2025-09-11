import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { CommonModalComponent } from '../common-modal/common-modal.component';
import { DatashareService } from 'src/app/services/datashare.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import moment from 'moment';
import { FAQDialogComponent } from '../faq-dialog/faq-dialog.component';
// import { CommonModalComponent } from '../common-modal/common-modal.component';

@Component({
  selector: 'app-advance-salary',
  templateUrl: './advance-salary.component.html',
  styleUrls: ['./advance-salary.component.scss']
})
export class AdvanceSalaryComponent implements OnInit {

  userDetails:any;
  lastSalaryDetails: any = {};
  serviceProvider: any = {}
  receivedData: any;
  duesDetails:any;

  empConsentDetails: any;
  aadharRefNo: any;
  employeeCode: any;
  phoneNo: any;
  emailId: any;
  sourceId: any;
  processId: any;
  currentAvailableSalary:any;
  menuDetails: any;
  tranDtl: any;
  pendingDetails: any;
  consentDetails:any;

  pieChartData:any = {};
  showChart: boolean = false;;
  pensionerData:any;
  config:AppConfig=new AppConfig();
  constructor(private dialog:MatDialog,
    private apiService:ApiService,
    private dataShareService:DatashareService,
    private snackBar:SnackbarService, 
    private router:Router,
  private load:LoaderService) { }

  ngOnInit(): void {
    this.apiService.configMenu = { IsShow: true };
    let details = sessionStorage.getItem('userDetails');
    if(details)
      {
        let data=JSON.parse(this.config.decrypt(details))
        this.pensionerData=data[0]
      }
    console.log('this.apiService.configMenu', this.apiService.configMenu);


    this.userDetails = this.apiService.userInfo();
    console.log("user info", this.userDetails);
    const ssoIdData = { ssoId: this.userDetails.ssoId };
    this.dataShareService.setData(ssoIdData);
    // this.getMenuDetails();
 
   
      this.getLastSalaryDetails();
    

    // this.apiService.consentDetailsCast.subscribe((res:any)=>{
    //   this.consentDetails = res;
    //   console.log("consentDetails",this.consentDetails);
      
    //   if(this.consentDetails){
    //   this.getLastSalaryDetails();
    //   }
      


    //   //earnedAdvSalaryMaxLimit
    //   // this.earnedAdvSalaryLimit = this.advancedetails.currentAvailableSalary - this.advancedetails.amountPendingRepayment;

    //   //maxLimitPerTransaction

    //   // if(this.earnedAdvSalaryLimit > this.advancedetails.maxLimitPerTransaction){
    //   //   this.earnedAdvSalaryMaxLimit = this.advancedetails.maxLimitPerTransaction;
    //   // } else {
    //   //   this.earnedAdvSalaryMaxLimit = this.earnedAdvSalaryLimit;
    //   // }

      
    // });
    
    
    
    

  }

  
  requestAdvance(){
    
    this.router.navigate(['/advance-pension/earned-advance-withdraw']);
  
  }

  
  discontinueService(){
    {

      let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
      this.load.show();
      let requestData = {
        "ppoNo":sendData
        // "employeeId":this.lastSalaryDetails?.empId || null,
        // "netSalary": this.lastSalaryDetails?.grossAmnt || null,
        // "deductibleAmnt":0,
        // "requestedAmnt":0,
        // "onDate":null,
        // "srvcAgentId":this.consentDetails?.consentDtl?.agentId,
      }
  
    this.load.show();
      this.apiService.pension(requestData,'getCurrentExtAvailablePension').subscribe({
        // this.apiService.postmst('getEmployeeLastSalaryDetails', { employeeCode: "RJJP199417012779" }).subscribe({
        next: (res:any) => {
          this.load.hide();
          if(res.data)
            {
              let jsonData=JSON.parse(res.data)
          this.currentAvailableSalary = jsonData
          console.log('Current Salary Details', this.currentAvailableSalary);
          if(this.currentAvailableSalary.amountPendingRepayment>0){
            this.dialog.open(CommonModalComponent,{
              autoFocus: false,
              // disableClose: true,
              width: '',
              data: {
                
                id: 'cant-discontinue'
                
              },
            });
          }
          else{
            const confirmDialog=this.dialog.open(CommonModalComponent,{
              autoFocus: false,
              disableClose: true,
              width: '',
              data: {
                
                id: 'discontinue'

              },
            });
        
            confirmDialog.afterClosed().subscribe(data => {
        
              if (data === 'Y') {
                this.sendOtpData();
              }
            })
          }
          
            }}
      })
  
  
    }

    
    
  }

  getDetails(){
    {
      let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
      let reqDetails={
        "ppoNo":sendData,
      "startDt":'',
      "endDt":''
      }
      console.log("dashboard",reqDetails)
      this.load.show();
      this.apiService.pension( reqDetails,'getDashBoardDetails').subscribe({
        next: (res:any) => {
          this.load.hide();
          if(res.data)
            {
              let data:any=JSON.parse(res.data)
              console.log("dashboard",data)
          this.duesDetails = data.dueAmntDtl;
          this.tranDtl = data.tranDtl;
          console.log("tranDtl", this.tranDtl)
          this.apiService.setTransactionDetails(this.tranDtl);
          this.pendingDetails = data;
         
          
          this.pieChartData={
            type: 'doughnut', //this denotes tha type of chart
      
            data: {// values on X-Axis
              labels: [this.pendingDetails.dueAmt,this.pendingDetails.netPsnAmt,],
              datasets: [
                {
                   label: " ",
                  data: [this.pendingDetails.dueAmt, this.lastSalaryDetails.netAmnt],
                  backgroundColor: ['#F5C779', '#52BB9C']
                }
              ]
            },
            options: {
              aspectRatio: 2.5
            }
      
          }
          console.log('pieChartData',this.pieChartData);
          this.showChart = true;

          
        }}
      })
  
  
    }

    

    
    
  }

  
  getLastSalaryDetails = () => {
    this.load.show();
    let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
    this.apiService
      .pension( {
        ppoId: sendData
      
      },'getCurrentAvailablePension')
      .subscribe({
      next: (res:any) => {
        this.load.hide();
        if(res.data)
          {
            this.lastSalaryDetails = res.data;
            console.log("lastSalaryDetails",this.lastSalaryDetails)
          }
      
        
        this.getDetails();
        this.getEmployeeEarnedAdvanceSalaryConsent();
        let consentDetails = {
          ...this.lastSalaryDetails,
          "utFlag": "Y",
          "utDt": null,
          "hodApprvd": "N",
          "hodApprvdDt": null,
          "hodApprvdBy": null,
          "source": null,
          "svcAgencyId": this.serviceProvider.agentsrvcId,
        }
        localStorage.setItem('consentDetails', JSON.stringify(consentDetails));
      }
    })


  }

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
        console.log('earnedAdvSal/getEmployeeConsent API', res)
        this.empConsentDetails = res;
        sessionStorage.setItem('empConsentDetails', JSON.stringify(this.empConsentDetails));
        this.apiService.setConsentDetails(this.empConsentDetails);
        console.log('settingdata', this.empConsentDetails);
        console.log(this.empConsentDetails);
        this.aadharRefNo = this.empConsentDetails.psndtl.aadharRefNo;
        this.employeeCode = this.empConsentDetails.psndtl.employeeCode;
        this.phoneNo = this.empConsentDetails.psndtl.phoneNo;
        this.emailId = this.empConsentDetails.psndtl.emailId;
        this.sourceId = this.empConsentDetails.sourceId;
        this.processId = this.empConsentDetails.processId;
     
        console.log("response",this.empConsentDetails);
        // if(this.empConsentDetails)
        if(this.empConsentDetails.consentDtl.ifmsStatus==='Success' && this.empConsentDetails.consentDtl.agencyKycStatus==='Pending')
        {
          
          this.dialog.open(CommonModalComponent, {
            autoFocus: false,
            disableClose: true,
            width: '',
            panelClass:'small-dialog',
            data: {
              
              id: 'kyc-pending',
              
            },
          });
        }
      }
    })
  }


  sendOtpData() {
    let requestData = {
      ssoId: this.userDetails.ssoId,
      sourceId: this.sourceId, //getEmployeeEarnedAdvanceSalaryConsent
      processId: this.processId, //getEmployeeEarnedAdvanceSalaryConsent
      // processId: 3, //getEmployeeEarnedAdvanceSalaryConsent
      mobileNo: this.phoneNo, //getEmployeeEarnedAdvanceSalaryConsent
      ipAddress: '0.0.0.0',
    };
    this.load.show();
    this.apiService.postOr('otp/otpGenerate', requestData).subscribe({
      next: (res:any) => {
        this.load.hide();
        this.receivedData = res;
        console.log('recieved data ==>', this.receivedData);
        // this.reqID = this.receivedData.reqId;
        console.log('RquestId', this.receivedData.reqId);
        // this.dataShareService.getData(this.reqID);
        // if (!this.showResendButton) {
        //   const reqIdData = { reqId: this.reqID };
        //   this.dataShareService.setData(reqIdData);
        // }

        // this.dialogRef.close();
                const confirmDialog = this.dialog.open(CommonModalComponent, {
          autoFocus: false,
          disableClose: true,
          width: '',
          panelClass:'small-dialog',
          data: {
            sourceId: this.sourceId,
            processId: this.processId,
            mobileNo: this.phoneNo,
            requestId: this.receivedData.reqId,
            action: '',
            id: 'otp',
            
          },
        });

        confirmDialog.afterClosed().subscribe(data => {

          if (data) {
            this.verifyOtp(data);
          }
        })
      },
    });
  }



  verifyOtp(data: any) {
    console.log('advSalar', data);
    const otpString = data;

    // this.reqID = this.dataShareService.dataEmitted[2].reqId;

    let requestDataVerify = {
      ssoId: this.userDetails.ssoId,
      sourceId: this.sourceId, ////getEmployeeEarnedAdvanceSalaryConsent
      processId: this.processId, //getEmployeeEarnedAdvanceSalaryConsent
      // processId: 3, //getEmployeeEarnedAdvanceSalaryConsent
      mobileNo: this.phoneNo, //getEmployeeEarnedAdvanceSalaryConsent
      reqId: this.receivedData.reqId, //response of otp/otpGenerate
      otpCode: otpString,
      otpEnv: 'T', // for now its "T" but will received going forward through environment
    };
    this.load.show();
    let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
    this.apiService
      .postOr('otp/otpVerify', requestDataVerify)
      .subscribe((res:any) => {
        this.load.hide();
        console.log('api response  advance', res);
        if (res.verified === 'Y') {
          console.log("userInfo",this.userDetails);
          
          let updateDiscontinue = {
          ppoNo: sendData,
          srvcAgentId: 1,
          discontinueFlag: "Y"
}
          this.apiService.pension(updateDiscontinue,'utDiscontinueFlagUpdate')
          .subscribe((res:any)=>{
            console.log("discontinue response", res);
            
            if (res.status === 'SUCCESS') {

              

              this.dialog.open(CommonModalComponent, {
                autoFocus: false,
                disableClose: true,
                width: '',
                data: {
                  action: '',
                  id: 'confirm-otp',
                },
              });
              
            }
            else {
              alert('Sorry, an error has occurred. Please try again later');
              
              this.snackBar.show(res?.error?.description, 'danger');
            }

          })
          // this.saveConsentObject = JSON.parse(
          //   localStorage.getItem('consentDetails')!
          // );
          // console.log('consent', this.saveConsentObject);
          // this.saveEarnedAdvanceSalaryUndertaking();
          // this.closeDialog();

          
        } else {
          this.snackBar.show(res?.error?.description, 'danger');
        }
      });
  }

  showTransactions(){
    console.log("method called");
    
    // this.router.navigate([]);
}
faqDialog()
{
  this.dialog.open(FAQDialogComponent,{
    autoFocus: false,
    // disableClose: true,
    width: '70%',
    height:'80%'
  });
}
}
