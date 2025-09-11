import { Component, OnInit } from '@angular/core';
import { CommonModalComponent } from '../common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AppConfig } from 'src/app/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advance-withdraw',
  templateUrl: './advance-withdraw.component.html',
  styleUrls: ['./advance-withdraw.component.scss']
})
export class AdvanceWithdrawComponent implements OnInit {

  public chooseBy:string = 'Number of days';

  public maxRange:number;
  public minRange:number;
  public sliderValue:number|null;
  public stepValue:number = 1;
  public transactionFee:number = 0;
  public earnedAdvSalary:number;
  public earnedAdvSalaryLimit:number;
  public earnedAdvSalaryMaxLimit:number;
  advanceSalaryWithdrawalForm:any;
  receivedData: any;
  empinfo: any;
  consentDetails: any;
  advancedetails: any;
  showMinLimitError: boolean = false;
  showMaxLimitError: boolean = false;
  lastSalaryDetails: any;
  tranDtl: any;
  pensionerData:any
  config:AppConfig=new AppConfig()
  constructor(
    private dialog: MatDialog,
    private formbuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: SnackbarService,
    private load: LoaderService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.apiService.configMenu = { IsShow: true };
    let details = sessionStorage.getItem('userDetails');
    if(details)
      {
        let data=JSON.parse(this.config.decrypt(details))
        this.pensionerData=data[0]
      }
    console.log("pensionerData",this.pensionerData)
    this.getDaysRange();
    // this.transactionFee = 50;
    // this.earnedAdvSalary = 50000;
    // this.earnedAdvSalaryLimit = 1000;
this.getCurrentDate()
    this.empinfo = this.apiService.userInfo();
    console.log('this.empinfo', this.empinfo);
    this.advanceSalaryWithdrawalForm = this.formbuilder.group({
      amount: ['', [Validators.required]],
    });
    //Validators.min(50), Validators.max(this.earnedAdvSalaryMaxLimit)

    
    this.consentDetails = JSON.parse(sessionStorage.getItem('empConsentDetails')!);
    console.log('onInitData', this.consentDetails);
    //this.consentDetails =  sessionStorage.getItem('empConsentDetails');
    this.getLastSalaryDetails();

    // this.apiService.consentDetailsCast.subscribe((res:any)=>{
    //   this.consentDetails = res;
    //   console.log("ye wala",this.consentDetails);
    //   console.log("consentDetails",this.consentDetails.consentDtl);

    //   this.getLastSalaryDetails();



    //   //earnedAdvSalaryMaxLimit
    //   // this.earnedAdvSalaryLimit = this.advancedetails.currentAvailableSalary - this.advancedetails.amountPendingRepayment;

    //   //maxLimitPerTransaction

    //   // if(this.earnedAdvSalaryLimit > this.advancedetails.maxLimitPerTransaction){
    //   //   this.earnedAdvSalaryMaxLimit = this.advancedetails.maxLimitPerTransaction;
    //   // } else {
    //   //   this.earnedAdvSalaryMaxLimit = this.earnedAdvSalaryLimit;
    //   // }


    // });

    this.apiService.transDetailsCast.subscribe((res:any)=>{
      this.tranDtl = res;
    })


  }

  formatLabel(value: number) {
    // if (value >= 1000) {
    //   return Math.round(value / 1000);
    // }
    return value;
  }
  getCurrentDate()
  {
 

  this.apiService.post( 'currentdate',{}).subscribe({
    next: (res) => {
        console.log("res" ,res.data)
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
  onChoosenByClick(value: number){
    if(value === 1){
      this.chooseBy = 'Number of days';
      this.getDaysRange();
      this.sliderValue = this.minRange;
      this.stepValue = 1;
    } else {
      this.chooseBy = 'amount needed';
      this.getAmountrange();
      this.sliderValue = this.minRange;
      this.stepValue = 50;
    }
    this.getTransactionFees();
  }

  getDaysRange(){
    this.minRange = 1;
    this.maxRange = 30;
  }

  getAmountrange(){
    this.minRange = 50;
    this.maxRange = 60000;
  }

  changeSlidervalue(value:number|null){
    this.sliderValue = value;
    this.getTransactionFees();
  }

  getTransactionFees(){
    if(this.sliderValue){
      this.transactionFee =  Math.round((this.sliderValue * 1) /100);
    }
  }
  getLastSalaryDetails = () => {
    this.load.show();
    let sendData=this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4)
    this.apiService
      .pension( {
        ppoId: sendData
      
      },'getCurrentAvailablePension').subscribe({
      
      next: (res:any) => {
        this.load.hide();
        this.lastSalaryDetails = res.data;


        if(this.lastSalaryDetails){
          this.loadAdvancedata();
        }


        // let consentDetails = {
        //   ...this.lastSalaryDetails,
        //   "utFlag": "Y",
        //   "utDt": null,
        //   "hodApprvd": "N",
        //   "hodApprvdDt": null,
        //   "hodApprvdBy": null,
        //   "source": null,
        //   "svcAgencyId": this.serviceProvider.agentsrvcId,
        // }
        // localStorage.setItem('consentDetails', JSON.stringify(consentDetails));
      },
      error:(err)=>{

      }
    })


  }

  loadAdvancedata(){
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

    this.apiService.pension(requestData,'getCurrentExtAvailablePension' ).subscribe({
      next: (res:any) => {
        this.load.hide();
        if(res.error){
          this.dialog.open(CommonModalComponent, {
            autoFocus: false,
            disableClose: true,
            width: '',
            data: {
              reason:res?.error?.description,
              id: 'stop-withdrawal'
            },
          });
        }
        
        if(res.data)
          {
            let jsonData=JSON.parse(res.data)
            this.advancedetails = jsonData;
            console.log('advancedetails data ==>', this.advancedetails);
    
           this.earnedAdvSalary = this.advancedetails.currentAvailablePsn;
           this.earnedAdvSalaryLimit = Number(this.advancedetails.currentAvailablePsn) - Number(this.advancedetails.amountPendingRepayment);
    
           console.log('this.earnedAdvSalaryLimit line 167', this.earnedAdvSalaryLimit)
   
           if(this.earnedAdvSalaryLimit < this.advancedetails.maxLimitPerTransaction){
            this.earnedAdvSalaryMaxLimit = this.earnedAdvSalaryLimit;
           } else {
            this.earnedAdvSalaryMaxLimit = this.advancedetails.maxLimitPerTransaction;
           }
    
           console.log('this.earnedAdvSalaryMaxLimit line 173', this.earnedAdvSalaryMaxLimit)
    
          }

          if(JSON.stringify(res).includes('Advance Pension Window is closed for (22-Month End), Please try on 1st of Next Month'))
            {
              this.snackBar.show("Advance Pension Window is closed for (22-Month End), Please try on 1st of Next Month", 'danger');
              this.router.navigate(['advance-pension/earned-advance-salary'])
            }
       //maxLimitPerTransaction
      },
      error:(err)=>{
        this.load.hide();
        {

          this.dialog.open(CommonModalComponent, {
            autoFocus: false,
            disableClose: true,
            width: '',
            data: {
              desc:err?.error?.description,
              id: 'stop-withdrawal'
            },
          });




        }
        // this.snackBar.show(err?.error?.description || 'Something went wrong', 'danger');
      }
    });
  }


  openCalculationModal(){
    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      disableClose: true,
      width: '',
      data: {
        sourceId: '',
        processId: '',
        action: '',
        id: 'withdrawal-calc'
      },
    });



    confirmDialog.afterClosed().subscribe(data => {

      if (data === 'Y') {
        // this.onsubmit();
      }
    })
  }

  proceed(){

    this.showMinLimitError = false;
    this.showMaxLimitError = false;
// console.log("amount",this.advanceSalaryWithdrawalForm.value.amount, Number(this.earnedAdvSalaryMaxLimit))
    if(this.advanceSalaryWithdrawalForm.value.amount < 50){
     
      this.showMinLimitError = true;
      this.showMaxLimitError = false;
      //return;
    } 
    // else if(this.advanceSalaryWithdrawalForm.value.amount > Number(this.earnedAdvSalaryMaxLimit)){
      
    //   this.showMinLimitError = false;
    //   this.showMaxLimitError = true;
    //   //return;
    // } 
    else {

     console.log('a',this.consentDetails)
    this.load.show();
    let requestData = {
     "wAmt":this.advanceSalaryWithdrawalForm.value.amount,
    "srvcAgentId":this.consentDetails?.consentDtl?.agentId,
    'inType': 3,
    }
      this.load.show();
      this.apiService
      .pension( requestData,'getAdvancePension')
       .subscribe({
        next: (res:any) => {
          this.load.hide();
          console.log('recieved data ==>',res);
          if(res.data)
            {
             
          this.receivedData = res.data;
          console.log('recieved data ==>', this.receivedData);
          this.receivedData['wAmt']=this.advanceSalaryWithdrawalForm.value.amount
          const confirmDialog = this.dialog.open(CommonModalComponent, {
            panelClass: 'small-dialog', autoFocus: false,
            disableClose: true,
            data: {
              // sourceId: this.sourceId,
              // processId: this.processId,
              //mobileNo: this.phoneNo,
              // requestId: this.reqID,

              employeeCode:this.empinfo.employeeId,
              currentAvailableSalarydata: this.receivedData,
              ppoNo:this.pensionerData?.ppoNo+'-'+this.pensionerData?.accNo.slice(-4),
              action: '',
              id: 'proceed-adv-salary-withdrawal',
            },
          });
            }
        }
      });

    }








    //will be used for redirection
    // setTimeout(() => {
    //   location.href = `${location.origin}/#/ess/service-provider-website-component`;
    // }, 1000);
  }

}
