
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';//import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service'
// import { SnackbarService } from 'src/app/services/snackbar.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { Action } from 'rxjs/internal/scheduler/Action';
import { userInfo } from 'os';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import moment from 'moment';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { debounceTime, of, startWith, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';

import { RevisedAutoApprovedDialogComponent } from '../revised-auto-approved-dialog/revised-auto-approved-dialog.component';
import { CommonModalComponent } from 'src/app/pensioner/pension-related-request/common-modal/common-modal.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-commutation-requests',
  templateUrl: './commutation-requests.component.html',
  styleUrls: ['./commutation-requests.component.scss'],

  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class CommutationRequestsComponent implements OnInit {   
  isOfficeShow:boolean=true;
  displayedColumns: string[] = ["basic", "DA_h", "HRA_h", "Spcl_Pay", "npa", "cca"];
  userAction: Array<any> = [];
  action: string = 'INI';
  reqId: string = '';
  taskId: string = '';
  getCommutationForm: FormGroup;
  // @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  getCommutationList: Array<any> = [];
  dataSource!: MatTableDataSource<any>;
  employeeyInfo: any = {};
  userType: any = '';
  empId: any;
  user: any ={};
  roleid:any;
  isOffice: boolean =true;
  pensionInitOffice: any;
  office: any;
  imageUrl: any;
  userdetails:any;
  config:AppConfig=new AppConfig()
  @Input() picData: any;
  oOfficeId:any;
  serviceId: any;
  isVisible:boolean;
  empIdUserDtls:any;
  getPensionDtlsData:any;
  message:any;
  serviceSubId:any;
  // rotater: any = document.getElementsByClassName('toggler-button');
  // sidebarElement:any=document.getElementsByClassName('sidebar');
  constructor(private fb: FormBuilder, 
    public dialog: MatDialog, 
    public apiurl: ApiUrlService,
    private dashboardService:DashboardService, 
    private apiService: ApiService,  
    public shareModule: SharedModule,
    private datePipe: DatePipe,
    private snackbar:SnackbarService, 
    private router: Router)
    // private snackbar: SnackbarService,private breadcrum:breadcrumService
    { }
  ngOnInit(): void {

    
    this.isVisible=false;
    const numericNumberReg= '^-?[0-9]\\d*(\\.\\d{1,2})?$';
    this.getCommutationForm = this.fb.group({
      empCommutationFlag: new FormControl('Y', Validators.required),
      empCommutationDate: new FormControl('', Validators.required), 
      empCommutationPercentage: [0, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      empCommutationPercentageComfirm:[0, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]]
    })
    
    this.apiService .configMenu={isload:true} 
    this.apiService.configMenu = { isLoad: true }
    this.userdetails= this.config.getUserDetails();
    console.log("userdetails",this.userdetails)  
    console.log(this.user)   
    this.empId = this.userdetails[0].employeeCode;
    this.empIdUserDtls=this.userdetails[0].employeeId;
    this.serviceId=this.userdetails[0].serviceCatId;
    this.serviceSubId=this.userdetails[0].serviceSubCatId;
    console.log ("Service Id user>>>>> ",this.serviceId)
    this.getCommutation();
    this.getCurrentDate();
    this.checkOfficeId(3);
    this.getDepartmentList();
    this.getDocId()
    this.fetchpersonalEmp()
    this.getPaymentDetails()
   // this.dashboardService.setLoggedIn(true);

    this.getCommutationForm.patchValue({
      empCommutationFlag:"N"
    });
    this.getPensionDtls();
    //this.getCommutationForm.value.empCommutationFlag="N";

   // console.log("getCommutationForm==>>",this.getCommutationForm.controls["empCommutationFlag"].value);
    //alert(this.getCommutationForm.controls)
  }
  novalidation()
  {
    // let empCommutationPercentage = this.getCommutationForm.controls['empCommutationPercentage'].value.toFixed(2);
    // this.getCommutationForm.patchValue({
    //   empCommutationPercentage : empCommutationPercentage
    // })
  }
  payCalDetails:any
  getPaymentDetails(){
    var url = this.apiurl.url.getppodetails;
    var data = {
      "ssoId": this.userdetails[0].ssoId,
      "pensionerId": this.userdetails[0].pensionerId,
      "ppoNo":this.userdetails[0].ppoNo
    };
    this.apiService.postpension(url, data).subscribe((res: any) => {
      console.log("result>>>", res);
      this.payCalDetails=res.data[0];    
        console.log(this.payCalDetails)  
     })   
  }
  setCommutation1(){
 let isS:boolean=true;

 
    console.log(this.serviceId)
      let empCommutationPercentage = this.getCommutationForm.controls['empCommutationPercentage'].value;
      console.log(empCommutationPercentage);

      if (this.serviceId == 1 && (empCommutationPercentage > 40 || empCommutationPercentage == 0)) {
        this.getCommutationForm.patchValue({
          empCommutationPercentage : 40
        })
      } else if ((this.serviceId == 13 || (this.serviceId == 7 && this.serviceSubId == 108) ) && (empCommutationPercentage > 50 || empCommutationPercentage == 0)) {
        this.getCommutationForm.patchValue({
          empCommutationPercentage : 50
        })
      } else if((this.serviceId !== 1 && this.serviceId !== 13 && (this.serviceId !== 7 || (this.serviceId == 7 && this.serviceSubId != 108)) ) && (empCommutationPercentage > 33.33 || empCommutationPercentage == 0)){
        this.getCommutationForm.patchValue({
          empCommutationPercentage : 33.33
        })
    }else
    {
      this.getCommutationForm.patchValue({
        empCommutationPercentage : empCommutationPercentage
      })
    }
  }
  omit_special_char(val:any)
  {
     var k;
      document.all ? k = val.keyCode : k = val.which;

      return (  (k >= 48 && k <= 57) || k ==46);
  }
  validate(i:any)
  {
   
    var t=i.target.value;
    i.target.value=(t.indexOf(".")>=0)?(t.substr(0,t.indexOf(".")))+t.substr(t.indexOf("."),3):t;
    console.log(i.target.value)
  }
  setCommutation(i:any){

      let empCommutationPercentage = i.target.value;
      console.log(empCommutationPercentage);
      if(empCommutationPercentage<1)
      {
       
        this.getCommutationForm.patchValue({
          empCommutationPercentage : 33.33
        })
      }
      if (this.serviceId == 1 && (empCommutationPercentage > 40)) {
        this.getCommutationForm.patchValue({
          empCommutationPercentage : 40
        })
      } else if ((this.serviceId == 13 || this.serviceId == 7) && (empCommutationPercentage > 50 )) {
        this.getCommutationForm.patchValue({
          empCommutationPercentage : 50
        })
      } else if((this.serviceId !== 1 && this.serviceId !== 13 && this.serviceId !== 7) && (empCommutationPercentage > 33.33)){
        this.getCommutationForm.patchValue({
          empCommutationPercentage : 33.33
        })
    }else
    {
      // this.getCommutationForm.patchValue({
      //   empCommutationPercentage : empCommutationPercentage
      // })
     
      this.comPer=empCommutationPercentage
    }
  }
  setCom()
  {
   
    this.getCommutationForm.patchValue({
        empCommutationPercentage :  this.comPer.toFixed(2)
      })
      
  }
  comPer:any
  selfPic:any;
  jointPic:any;
  isSelf:boolean=true;
  isJoint:boolean=true
  getDocId()
{
 
  let data = {
"inMstType":27,
"inValue":0,
"inValue2":0,
"inValue3":this.userdetails[0].employeeCode
}

  this.apiService.post('allmstdata', data).subscribe((res:any) => {
    console.log("res",res)
   if(res.status=='SUCCESS')
   {
    if(res.data!=null)
    {
      let picdata=JSON.parse(res.data);
      console.log(picdata)
      picdata.forEach((element:any) => {
        if(element.vdocTypeId=='33')
        {
          this.selfPic=element.vdmsDocId
          if(this.selfPic!==null)
          {
            this.showPic(this.selfPic,1)
            this.isSelf=false
          }
          
        }
         if(element.vdocTypeId=='32')
        {
          this.jointPic=element.vdmsDocId
          if(this.jointPic!==null)
          {
          this.showPic(this.jointPic,2)
          this.isJoint=false
          }
        }
      });
    }else
    {
      alert("Employee details not found")
    }
   }

  })
}
jointUrl:any
showPic = (id: any,i:any) => {
  let data = {
    "type": "ess",
    "sourceId": 2,
    "docs": [
      {
        "docId": id
      }
    ]
  }
  console.log("single report data", data)
  this.apiService.postIntegration("wcc/getfiles", data).subscribe((res: any) => {
    console.log("res", res.data.document[0].content);
    if (res.data.document[0].content) {
      if(i==1)
      this.imageUrl = "data:image/jpeg;base64," + res.data.document[0].content;
      else if(i==2)
      this.jointUrl = "data:image/jpeg;base64," + res.data.document[0].content;
    }
  })
}
uploadFile1(event: any,i:any) {
  let time1 = new Date();
  const file =  event.target.files[0];
  if((file.size/1024)>500)
  {
    alert("Max 500KB file size allowed")
    return;
  }
  let ex2:any[]=file.name.split(".");  
  if(ex2[1]=='jpg' || ex2[1]=='JPG' || ex2[1]=='jpeg' || ex2[1]=='JPEG' )
  {
  }else
  {
    alert("Only jpg and jpeg formats are allowed");
    return;
  }
  const fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() +"."+ex2[1];
  var data4: any;
  const reader = new FileReader();
  reader.onloadend = () => {
    console.log(reader.result);
    // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
    data4 = reader.result;
    let data5 = data4.toString()
    let data6:any [] = [];
    data6=data5.split("base64,")
    //console.log(data4);
    let data1 = {
      "type": "image",
      "sourceId": 2,
      "docAttributes": [

      ],
      "data": [
        {
          "docTypeId": "1",
          "docTypeName": "photo",
          "docName": fileName,
          "docTitle": "essdoc",
          "content": data6[1]
        }
      ]
    }
    //console.log("data", data1);
    this.apiService.postIntegration("wcc/uploaddocs", data1).subscribe((res: any) => {
        console.log("res", res);
    if(res.status=="S")
    {     
      if (res.data.document[0].docId) {   
          alert("Your photo has been uploaded successfully.")
        } 
    }else {
      alert("Sorry, an error has occurred. Please try again later")
    }
       
      
    
    })
  };
  reader.readAsDataURL(file);
}
  officeData:any={};
  pofficeId:any;
  checkOfficeId(i:any)
  {
    let data:any;
    if(i==1)
    {
      if(this.oOfficeId==null || this.oOfficeId=='')
      {
        alert("Insert office id")
        
      }
      data = {
        "inMstType":28,
        "inValue":this.oOfficeId,
        "inValue2":0,
        "inValue3":""
        }
       // this.payEntitlement.patchValue({newPensionInitOffice : this.oOfficeId});

    }else if(i==2)
      {
        data = {
          "inMstType":28,
          "inValue":this.pofficeId,
          "inValue2":0,
          "inValue3":""
          }
      }else if(i==3)
      {
        data = {
          "inMstType":28,
          "inValue":this.userdetails[0].officeId,
          "inValue2":0,
          "inValue3":""
          }
      }
   console.log("check office",data);
   this.apiService.post('allmstdata', data).subscribe({
    next: (res:any) => {
      
      if (res.status = 200) {
       let data1 = JSON.parse(res.data);
        console.log("check res",data1)
        if(data1!=null)
        {
          this.officeData.officeHoName=data1[0]?.officeHoName;
          this.officeData.officeId=data1[0]?.officeId;
          this.officeData.officeName=data1[0]?.officeName;
          if(data1[0]?.officeHoName==null )
          {
            alert("HO is not present in this office. Kindly contact the respective Office.")
          }
        }else
        {
          alert("Please insert right office id and try again or you can used 'Do'nt Know' option.")
        }
      }
    },

  })
  }
  departmentList:any;
  searchdepartment = new FormControl();
  serchOffice = new FormControl();
  officeList:any
  getOfficeList()
  {
    let data = {
      "inMstType":22,
      "inValue":this.pdeptId,
      "inValue2":0,
      "inValue3":""
      }
    this.apiService.post('allmstdata', data).subscribe({
      next: (res:any) => {
        
        if (res.status = 200) {
          this.officeList = JSON.parse(res.data);
          console.log("this.officeList",this.officeList)
          this.$serchOffice = this.serchOffice.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.officeList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                 this.officeList.filter(
                    (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
  
                 )
              );
            })
          );
        }
      },
  
    })
  }
  getDepartmentList()
  {
    let data = {
      "inMstType":21,
      "inValue":0,
      "inValue2":0,
      "inValue3":""
      }
    this.apiService.post('allmstdata', data).subscribe({
      next: (res:any) => {        
        if (res.status = 200) {
          this.departmentList = JSON.parse(res.data);
          console.log("this.officeList",this.departmentList)
          this.$searchdepartment = this.searchdepartment.valueChanges.pipe(
            startWith(null),
            debounceTime(200),
            switchMap((res: any) => {
              if (!res) return of(this.departmentList);
              let fff = res;
              //console.log("shyam",fff);
              return of(
                 this.departmentList.filter(
                    (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
  
                 )
              );
            })
          );

        }
      },
  
    })
  }
  $searchdepartment = this.searchdepartment.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.departmentList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
         this.departmentList.filter(
            (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0

         )
      );
    })
  );

  $serchOffice = this.serchOffice.valueChanges.pipe(
    startWith(null),
    debounceTime(200),
    switchMap((res: any) => {
      if (!res) return of(this.officeList);
      let fff = res;
      //console.log("shyam",fff);
      return of(
         this.officeList.filter(
            (x: any) => x.vNameEnglish.toString().toLowerCase().indexOf(fff) >= 0
         )
      );
    })
  );
  pdeptId:any
  CommutationFormArray: any = []
  currentDate:any
  getCurrentDate()
  { 
    this.apiService.post('currentdate',{}).subscribe({
      next: (res:any) => {
     
        console.log("res",res)
        
          this.currentDate=res.data;
        this.currentDate=new Date(this.currentDate)
        this.currentDate.setDate(1);
        this.currentDate.setMonth(this.currentDate.getMonth()+1)
          console.log("res" ,this.currentDate)
          this.getCommutationForm.patchValue({empCommutationDate:this.currentDate})        
         
      }
    })  
  }
  changeCommutation() {
    if (this.getCommutationForm.value.empCommutationFlag === 'Y') {
      this.getCommutationForm.controls['empCommutationDate'].enable();
      this.getCommutationForm.controls['empCommutationPercentage'].enable();
      
    } 
    else if  (this.getCommutationForm.value.empCommutationFlag === 'N') { 
      this.getCommutationForm.controls['empCommutationDate'].disable();
      this.getCommutationForm.controls['empCommutationPercentage'].disable();
      // this.getCommutationForm.patchValue({ empCommutationDate: '' }) 
      // this.getCommutationForm.patchValue({ empCommutationPercentage: '' })  

    }
  }
  ngOnDestroy() {
    sessionStorage.removeItem('ifm_emp_in');
  } 
  verifyMobileNo(): void {
    

    if(this.getCommutationForm.value.empCommutationFlag=='N')
    {
      alert("Please first select commutaion after that click submit button.");
      return;
    }
    if(this.getCommutationForm.value.empCommutationFlag=='Y')
    {
    if(this.getCommutationForm.value.empCommutationPercentage==null || this.getCommutationForm.value.empCommutationPercentage=='' || this.getCommutationForm.value.empCommutationPercentage==undefined)
    {
     alert("Please Enter Commutation Percentage");
     return
    }
    if(this.getCommutationForm.value.empCommutationPercentage!=this.getCommutationForm.value.empCommutationPercentage)
    {
      alert("Commutation Percentage not confirm.please fill same value in both fields.");
      return;
    }
  }
    else{}
   
      if(this.userdetails[0].mobileNumber)
      { 
      let data={
        "ssoId":this.userdetails[0]?.ssoId,
        "sourceId":"1",
        "processId":"18",
        "mobileNo":this.userdetails[0].mobileNumber,
        "ipAddress":"10.1.1.1"
      }
      this.apiService.postIfms('otp/otpGenerate', data).subscribe({
        next: res => {
  
          console.log(res)
          this.verifyOtp(res);
         }
      })
    }
    else
    {
      alert("The Employee mobile number was not found");
    }
    
    
  }

  verifyOtp(res:any){
    
    const confirmDialog = this.dialog.open(CommonModalComponent, {
      autoFocus: false,
      width: '350px',
      data: {
        action: '',
        id: 'otp',
        otpData:res,
        mobileNo:this.userdetails[0].mobileNumber
      },
    });

    confirmDialog.afterClosed().subscribe(data => {
      console.log("data",data);
      // this.verifySubmit();
      if (data.verified === 'Y') {
       
        this.verifySubmit();
      }else{
        alert("The OTP (One-Time Password) was not verified")
      }
    
    })
  }
  verifySubmit()
  {
    if(this.selfPic==null || this.selfPic==undefined || this.selfPic=='')
    {
      alert("Please upload Self photograph.");
      return;
    }
    if(this.jointPic==null || this.jointPic==undefined || this.jointPic=='')
    {
      alert("Please upload Joint photograph.");
      return;
    }
    if(this.getCommutationForm.value.empCommutationFlag=='N')
    {
      alert("Please first select commutaion after that click submit button.");
      return;
    }
    if(this.getCommutationForm.value.empCommutationFlag=='Y')
    {
    if(this.getCommutationForm.value.empCommutationPercentage==null || this.getCommutationForm.value.empCommutationPercentage=='' || this.getCommutationForm.value.empCommutationPercentage==undefined)
    {
     alert("Please Enter Commutation Percentage");
     return
    }
  }
    else{}
    const requestData = {
      "psnId": this.userdetails[0]['pensionerId'],
      "empId":  this.userdetails[0]['employeeId'],
      "empCode":  this.userdetails[0]['employeeCode'],
      "commutFlag": this.getCommutationForm.value.empCommutationFlag,
      "commutDate": this.getCommutationForm.value.empCommutationDate === undefined ? '' : this.datePipe.transform(this.getCommutationForm.value.empCommutationDate, 'dd/MM/yyyy'),
      "officeId":  this.officeData?.officeId,
      "flag": 0,
      "singlePhoto": this.selfPic,
      "jointPhoto": this.jointPic,  
      "comPercent": this.getCommutationForm.value.empCommutationPercentage,
      "assignmentId": this.userdetails[0]['employeeId'],
      "psnTypeId":this.userdetails[0]?.PsnTypeId?this.userdetails[0]?.PsnTypeId:"68"
    }  
 
     console.log("Commutation Form Data ===>>>",requestData); 

    // if (requestData.comPercent==''){
    //   alert( 'Please Enter Commutation Percentage');
    // }

    this.apiService.postpension('submitrevisedcommutation', requestData).subscribe({
      next: res => {
        if(res.data){
           if(res.status=='SUCCESS'){
             // alert(res.data[0].Message)
             
            //  if(res.data[0].Message=="This Record already inserted")
            //  {
            //   alert("The Request already Submitted.")
            //  }else{
            //   this.getRevisedPensionerList();
            //  }
            
              this.dialog.open(CommonDialogueBoxComponent,                 
                {data: { 
                  resData:res,                              
                  Actiontype:"CommutationSuccess",
                  getEventStatus: (event: any)=>{console.log(event) ;
                    (res.data[0].Message);                              
                  }
                },         
              });
            
           }                
            
          //this.snackbar.show('Your Commutation Request has been submitted', 'success');
        }
      }, error: err => {
        this.snackbar.show("some error occur", 'danger');
      }
    })    
  }
  isCalculation:boolean=false
  confirmper()
  {
    if(this.getCommutationForm.value.empCommutationPercentage!=this.getCommutationForm.value.empCommutationPercentageComfirm)
    {
      alert("Commutation Percentage not confirm.please fill same value in both fields.");
      this.isCalculation=false
      return;
    }else{
      this.commutationDateCalculation();
      this.isCalculation=true
    }
  }
  Pension_Commutation:any
  commutationDateCalculation() {
  

    let data = {
      "employeeCode": this.userdetails[0].employeeCode,
      "pensionTypeId": this.userdetails[0]?.PsnTypeId?this.userdetails[0]?.PsnTypeId:"68",
      "withheldAmount": 0,
      "deductionAmount": [{
        "dedAmount": 0
      }],
      "recoveryAmount": [{
        "recAmount": 0
      }],
      "allowanceAmount": 0,
      "dateOfVCD": "",
      "cpoEfDate":this.getCommutationForm.value.empCommutationDate? moment(this.getCommutationForm.value.empCommutationDate).format("DD-MMM-YYYY"):"",
      "isPaperLess": 0,
      "cpoValue":this.getCommutationForm.value.empCommutationPercentage? this.getCommutationForm.value.empCommutationPercentage:"",
      "deFlag":  0,
      "deType":   "",
      "qualifyingService": [],
      "nonQualifyingService": [],
      "isPayCommission":this.Calculations_Pay_Details?.payCommissionNameEn ? this.Calculations_Pay_Details.payCommissionNameEn : '',
      "isMilitary": '',
      "basicPay": this.payCalDetails.basicPay ? Number(this.payCalDetails.basicPay) : 0,
      "marStatus":this.userdetails[0]?.maritalStatus?this.userdetails[0]?.maritalStatus:""
    }

    
    console.log("data", data);
    var ser_data: any[] = [];
    this.apiService.empServicese( 'callPensionCalculationRuleEngine',data).subscribe({
      next: (res:any) => {
       

          console.log("res", res);
          ser_data.push(res.data);
          console.log("res", ser_data);


         
          this.Pension_Commutation=JSON.parse(JSON.stringify(res.data))
      
      },
      error: (err) => {
        // let errorObj = {
        //   message: err.message,
        //   err: err,
        //   response: err,
        // };
        alert("Data not load properly so please Press Refresh Button.")
      }, complete: ()=> {
    
        
      }
    });
    

  }
  getRevisedPensionerList()
{
  this.apiService.postpension("getrevisepensiondtls",{'officeId':this.userdetails[0].officeId}).subscribe((res:any)=>
  {
    console.log("res",res)
  
      let data=res.data
      data.forEach((element:any) => {
        if(element.employeeCode==this.userdetails[0].employeeCode)
        {
          
          let data={
            "employeeCode":element.employeeCode,
            "employeeId":element.employeeId,
            "psnType":element.psnType,
            "officeId":element.officeId,
            "traseCode":element.treasCode,
            "assignmentId":element.assignmentId,
            "dor":element.dateOfRetirement,
            "item":element
          }
          this.dialog.open(RevisedAutoApprovedDialogComponent, { width: '60%', data: { message: data }, disableClose: true }).afterClosed()
          .subscribe((data:any) => {
            // this.getRevisedPensionerList();
           console.log('complete',data)
             if(data.data=='Y')
             {
              alert("Your request have been successfully submitted.");
              setTimeout(() => {
                this.router.navigate(['MyDashboard'])
              }, 200);
             
             }else
            {
              
           }
        }
      )
        }
      });
    
  
  })
}
  getCommutation = () => {  
    
    this.apiService.postNewEmployee('getCommutation', { "employeeId": this.userdetails[0].employeeCode }).subscribe({
      next: (res:any) => {
        this.employeeyInfo = res.data[0];  
        console.log(this.employeeyInfo);
        console.log(this.userdetails);        
        this.getCommutationForm.patchValue({
          empCommutationFlag: this.employeeyInfo.comFlag === null ? 'N' : this.employeeyInfo.comFlag,
          empCommutationPercentage: this.employeeyInfo.comPercent ? this.employeeyInfo.comPercent : 0,
        })
        this.setCommutation1();  
        this.dataSource = new MatTableDataSource<string>(res.data);
        this.dataSource.paginator = this.paginator;
      }
    })
  }
  selectOption(event: any){
    this.checkOfficeId(3);  
    if(event.value == 1){
      this.isOffice = true;
      this.isOfficeShow=true;
      this.isList=false
      this.isKnow=false
     this.pensionInitOffice=this.office;
    }else{
      this.isOfficeShow=false;
      this.isOffice = false;
      this.isKnow=true
      this.isList=true      
    }
  }
  isKnow:boolean=false
  isList:boolean=false
  selectOption2(event: any){
    if(event.value == 1){
     
      this.isList=true
    }else{
     
      this.isList=false
    }
  }
  uploadFile(event: any,i:any) {
    let time1 = new Date();
    const file = event.target.files[0];
    if ((file.size / 1024) > 500) {
      alert("Max 500KB file size allowed")
      return;
    }
    let ex2: any[] = file.name.split(".");
    if (ex2[1] == 'jpg' || ex2[1] == 'JPG' || ex2[1] == 'jpeg' || ex2[1] == 'JPEG') {
    } else {
      alert("Only jpg and jpeg formats are allowed");
      return;
    }
    const fileName ="doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString()+ "." + ex2[1];
    var data4: any;
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      data4 = reader.result;
      let data5 = data4.toString()
      let data6: any[] = [];
      data6 = data5.split("base64,")
      //console.log(data4);
      let data1 = {
        "type": "image",
        "sourceId": 2,
        "docAttributes": [
        ],
        "data": [
          {
            "docTypeId": "1",
            "docTypeName": "photo",
            "docName": fileName,
            "docTitle": "essdoc",
            "content": data6[1]
          }
        ]
      }
      console.log("data", data1);//alert(i)
      this.apiService.postIntegration("wcc/uploaddocs", data1).subscribe({
        next: (res:any) => {
          console.log("res", res);
          if (res.data.document[0].docId) {            
            if(i==1)
            {
              this.imageUrl = data5;
              this.selfPic=res.data.document[0].docId
            }else if(i==2)
            {
              this.jointUrl = data5;
              this.jointPic=res.data.document[0].docId
            }            
            alert("Your photo has been uploaded successfully.")
          } else {
            alert("Sorry, an error has occurred. Please try again later")
          }
        }, error: err => {
          alert("Error in upload pic service.Please try after some time.")
         // this.snackbar.show(err?.error?.description || 'Server Error', 'danger');
        }
      })
    };
    reader.readAsDataURL(file);
  }

  // fetchpensionerdtls

  getPensionDtls(){
    //alert(this.empIdUserDtls)
    let payload= {

      // "empId":this.empIdUserDtls
      "empId":0,"reqId":289,"pensionerId":0
    }
    this.apiService.postpension('fetchpensionerdtls',payload).subscribe((res:any)=>{
      console.log("New service",res);
      this.getPensionDtlsData=res.data[0];

      console.log("details data is here>>>>>>>>>>",this.getPensionDtlsData.requestId)
      
      if(res.data[0].flag==0)
      {        
        this.message="Your Request Is In_Process."
      }
      else if(res.data[0].flag==1)
      {
         this.message="Your Request Is Approved."
      }
      else if(res.data[0].flag==2)
      {
        //alert("Rejected")
        this.message="Your  Request Is Rejected."
      }
      else if(res.data[0].flag==-1)
      {       
        this.message="Your Request Is Not_Initiated."
      }  
      else {
        this.message=""       
      }
      // "flag": 0,
      // "requestId": "122",
    })
  }
  Calculations_Pay_Details:any
  fetchpersonalEmp() {
    let data = {
      "employeeId": this.userdetails[0].employeeId
    }
    this.apiService.empServicese('getEmployeePayDetails',data).subscribe({
      next: (res:any) => {
        if ((res.status = 200)) {
         
          this.Calculations_Pay_Details = res.data;
          this.Calculations_Pay_Details = JSON.parse(JSON.stringify(this.Calculations_Pay_Details).replace(/\:null/gi, "\:\"\""));
       
          // this.conditionForm.patchValue({ condition_1_Amount: this.condition1Amount });
        }
      },
      error: (err) => {
        let errorObj = {
          message: err.message,
          err: err,
          response: err,
        };
      },
    });
  }
}


