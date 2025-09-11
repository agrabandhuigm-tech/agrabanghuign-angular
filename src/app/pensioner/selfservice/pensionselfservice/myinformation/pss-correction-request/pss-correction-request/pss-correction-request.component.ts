import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { TokenManagementService } from 'src/app/services/token-management.service';

@Component({
  selector: 'app-pss-correction-request',
  templateUrl: './pss-correction-request.component.html',
  styleUrls: ['./pss-correction-request.component.scss']
})
export class PssCorrectionRequestComponent implements OnInit {
   @ViewChild(MatStepper) stepper: MatStepper;
  firstFormGroup: any;
  secondFormGroup: any;
  thirdFormGroup: any;
  forthFormGroup: any;
  fifthFormGroup: any;
  addressData: Subject<boolean> = new Subject();
  profileData: Subject<boolean> = new Subject();
  bank: Subject<boolean> = new Subject();
  monthly: Subject<boolean> = new Subject();
  userdetails:any;
  config=new AppConfig()
  constructor(private tokenInfo:TokenManagementService,
    private apiService:ApiService,
  public common:CommonService,private router:Router,public dialog: MatDialog) { }
  user:any;
  pensionerDtls:any;
  ngOnInit(): void {
    this.user=  this.tokenInfo.empinfoJWTService;
   
    this.pensionerDtls= this.apiService.getPensionerDtls;
    console.log("profileDetail",this.pensionerDtls);
    this.userdetails= this.config.getUserDetails();
    console.log("userdetails",this.userdetails)
  }
  savedata(i:any)
  {
    if(i==1)
    {
      this.addressData.next(true);
    }else if(i==2)
    {
      this.bank.next(true);
    }else if(i==3)
    {

      this.monthly.next(true);
      
    }else if(i==4)
      {
        this.profileData.next(true);
      }
    
  }
  moduleDataList:any[]=[
    {moduleName:'Address Details',isUpdated:1},
    {moduleName:'Bank Details',isUpdated:1},
    {moduleName:'Change Monthly Treasury',isUpdated:1},
    {moduleName:'Change Profile Details',isUpdated:1}
  ]
updateModuleDataList(i:any)
{
 
 console.log("moduleDataList",this.moduleDataList) 
  if(i==1)
    {
      this.moduleDataList[0].isUpdated=0;
      this.stepper.next();
    }else if(i==2)
    {this.moduleDataList[1].isUpdated=0;
      this.stepper.next();
    }else if(i==3)
    {
      this.moduleDataList[2].isUpdated=0;
      let isSubmit=false
      this.moduleDataList.forEach((item:any,i:any)=>{
        if(item.isUpdated==1)
        {
          isSubmit=true
        }})
      if(isSubmit)
      {
      this.verifyMobileNo();
      }else{
        this.common.openErrorModal("Please select minimun one module to update.","");
      }
  
    }else if(i==4)
      {
        this.moduleDataList[3].isUpdated=0;
        this.stepper.next();
      }
}
addressFinal:any
bankData:any
monthlyData:any
  profileDataFinal:any;
  
  getData(data: any) {
    console.log("data", data);
      switch (data.step) {
        case 1:
         this.addressFinal = data.value;
         console.log("addressFinal", this.addressFinal);
         this.stepper.next();
          break;
        case 2:
          this.bankData = data.value;
          console.log("bankData", this.bankData);
         this.stepper.next();
          break;
  
        case 3:

          this.monthlyData = data.value;
          console.log("monthlyData", this.monthlyData);
          let isSubmit=false;
      this.moduleDataList.forEach((item:any,i:any)=>{
        if(item.isUpdated==1)
        {
          isSubmit=true;
         
        }
      }
    )
        console.log("isSubmit",isSubmit)
      if(!isSubmit)
      {
        this.common.openErrorModal("Please select minimun one module to update.","");
      }else
      {
        this.verifyMobileNo();
      }
          break;
          case 4:
            this.profileDataFinal = data.value;
            console.log("profileDataFinal", this.profileDataFinal);
            this.stepper.next();
            break;
        
      }
      
    }
        verifyMobileNo(){
        //console.log(this.pensionerDtls[0].mobileNumber)
        if(window.origin.includes('ifmsdev'))
        {
          this.submitRequest(); 
        }else{
   if(this.pensionerDtls[0].mobileNumber)
        {
        let data={
          "ssoId":this.user?.ssoId,
          "sourceId":"1",
          "processId":"18",
          "mobileNo":this.pensionerDtls[0].mobileNumber,
          "ipAddress":"10.1.1.1"
        }
        this.apiService.postIfms('otp/otpGenerate', data).subscribe({
          next: res => {
            console.log("otp res data >>",res)
            this.verifyOtp(res);
           }
        })
      }
        else
        {
  
          this.common.openErrorModal("The Pensioner mobile number was not found","");
        }
        }
     
      }
    
      verifyOtp(res:any){
        const confirmDialog = this.dialog.open(CommonDialogueBoxComponent, {
          autoFocus: false,
          width: '350px',
          data: {
            action: '',
            id: 'otp2',
            otpData:res,
            mobileNo:this.pensionerDtls[0].mobileNumber
          },
        });
    
        confirmDialog.afterClosed().subscribe(data => {
          console.log("data",data);
          if (data.verified === 'Y') {    
            this.common.openSuccessModal("OTP verified successfully.");
            this.submitRequest();
          }else{       
          
            this.common.openErrorModal("The OTP (One-Time Password) was not verified","");
          }
        })
      }
    submitRequest()
    {
      

      let submitData:any={}
this.moduleDataList.forEach((item:any,i:any)=>{
  if(item.isUpdated==1)
  {
    if(i==0)
    {
      submitData['address']= this.addressFinal
    }else if(i==1)
    {
      submitData['bankData']=this.bankData
    }else if(i==2)
    {
      submitData['monthlyData']=this.monthlyData
    }else if(i==3)
    {
      submitData['profileData']=this.profileDataFinal
    }
  }
})
      let data={
        inType:1,
        data:{address:this.addressFinal,bankData:this.bankData,monthlyData:this.monthlyData,profileData:this.profileDataFinal},
        pensionerId:this.userdetails[0].pensionerId,
        processId:11,
        requestType:"P",
        userId:this.user?.userId,
        ipAddress:this.user?.ipAddress,
        moduleNameList:this.moduleDataList
      }
      console.log("finalData",data);
      this.apiService.postpension("pensionCorrectionProcess",data).subscribe((res:any)=>{
        console.log("res",res);
        if(res?.data[0]?.flag=="0")
        {
          this.common.openSuccessModal("Request submitted successfully.");   
          this.router.navigate(['MyDashboard'])       
        }else if(res?.data[0]?.flag=="1"){
          this.common.openErrorModal("Already a Pension Request is pending.Please check Pension in Pension Status.");
        }else if(res?.data[0]?.flag=="2"){
          this.common.openErrorModal("Already a Correction Request is pending.Please check Pension in Pension Status.");
        }else
        {
          this.common.openErrorModal("Error in service.","");
        }
      },(erro:any)=>{
        console.log("error",erro);
        this.common.openErrorModal("Error in service.","");
      }
      )
    }
    profileDocId:any;
    bankDocId:any;
    addressDocId:any;
    monthlyDocId:any;
    uploadFile(event:any,i:any)
    {
      console.log("file",event);
      console.log("file",i);
      this.common.uploadPDF(event,(res:any)=>{
        console.log("res",res);

        if (res.data.document[0].docId) {
          if(i==1)
          {
            this.profileDocId = res.data.document[0].docId;
          }
          if(i==2)
            {
              this.bankDocId = res.data.document[0].docId;     
            }
            if(i==3)
              {
               
                this.addressDocId = res.data.document[0].docId;     
              }
              if(i==4)
                {
                  this.monthlyDocId = res.data.document[0].docId;
                }
        }else{
          this.common.openErrorModal("Error in file upload.","")
        }
      })
    }
}
