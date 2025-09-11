import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import jsPDF from 'jspdf';
import domToImage from 'dom-to-image';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { AppConfig } from 'src/app/app.config';
import { CommonModalComponent } from '../common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, CanActivate } from '@angular/router';

import * as FileSaver from 'file-saver';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notional-increment',
  templateUrl: './notional-increment.component.html',
  styleUrls: ['./notional-increment.component.scss']
})
export class NotionalIncrementComponent implements OnInit {
  isnpa:boolean=true;
  notionalIncrementData: any ={};
  notionalIncrement: any;
payCommissionlist: Array<any> = [];
reportYear: any = '';
reportMonth: any = '';
userDetails: any[]=[];
payload: any[]=[];
isSubmitted: boolean = false;
documentId: any = '';
spdocumentId:any='';
npadocumentId:any=''
userdetails: any = {};
isError: boolean = false;
config : AppConfig = new AppConfig();
Object: any = Object;
files: any;
fileSize:any="2MB";
isLoading:boolean=false;
fileName: string = '';
nfilename:string=''
npafileName: string = '';
spfileName: string = '';
spfile: any;
npafile: any;
file:any;
nfile:any;
pensionerId:any;
assignmentid:any;
dor:any;
specialPay:any;
npa:any;
maxnpa:any=0
// payCommission:any;
@ViewChild('MonthlyPensionSlipToExport', {static: false}) public MonthlyPensionSlipToExport : ElementRef; 
  constructor(private apiEssService: ApiEssService,private apiService: ApiService,private formbuilder: FormBuilder,public cs:CommonService, public dialog: MatDialog,public router: Router) {
    this.userdetails= this.config.getUserDetails();
    console.log('here'+this.userdetails)
    // this.userdetails[0].ppoNo;
   }

  ngOnInit() {
    this.userdetails= this.config.getUserDetails();
    console.log("userdetails",this.userdetails)
    // let details = localStorage.getItem('profileDetails');
    // let decDetails = this.config.decrypt(details);
    // this.userdetails =  JSON.parse(decDetails);
    this.pensionerId= this.userdetails[0].pensionerId
    this.dor= this.userdetails[0].dateOfRetirement
    // this.dor='30-06-2024';
    // this.assignmentid =this.userDetails[0].assignmentid
    this.notionalIncrement = this.formbuilder.group({
      payScale: ['', Validators.required],
      basicpay: ['', Validators.required],
      payCommission: ['', Validators.required],
      attachDocument: new FormControl('',Validators.required ),
      specialPay:[],
      npa:[0],
      attachDocumentsp: new FormControl(''),
      attachDocumentnpaw: new FormControl(''),

    })
    this.PayCommission();
    this.getPayloadJson();
  }
  get searechEmpFormControl() {
    return this.notionalIncrement.controls;
  }
  spDocument(){
    this.specialPay=this.notionalIncrement.value.specialPay
    if(this.notionalIncrement.value.specialPay<-1 || this.notionalIncrement.value.specialPay>2000)
      {
        this.notionalIncrement.patchValue({'specialPay':0});
       alert("Please enter Special pay amount between 0 to 2000.")
      }
  }
  isNpaDoc:boolean=false;
  npaDocument(){
  
    if(this.notionalIncrement.value.npa<-1 || this.notionalIncrement.value.npa>this.maxnpa)
      {
        this.notionalIncrement.patchValue({'npa':0});
        alert("Please enter NPA amount between 0 to "+this.maxnpa+".")
      }else
      {
        this.npa=this.notionalIncrement.value.npa;
        this.isNpaDoc=true;
      }
  }
  deletedocument()
      {
        this.documentId=null;
      }
  payScalelist: any;
  PayCommission = () => {
    this.apiEssService.postmdm('getPayCommission', {}).subscribe(res => {
      this.payCommissionlist = res.data

    })
    this.cs.getJson({ requestId: null, empCode: '522619' },(res:any)=>{
                  
      if(res.personalDetails)
        {
          this.payload=JSON.parse(res.personalDetails);
          console.log("JSON",this.payload)
          // this.addtionalArray=this.payload.additionalPension;
          // console.log("additionalPension",this.addtionalArray)
        }else{
          // this.common.openErrorModal("JSON Service have Error","",()=>{})
        }
    
    });
  }
  payScale = () => {

     
        let data = {
          "payCommissionId": this.notionalIncrement.value.payCommission,
        }
        this.apiService.postemp('getPayScale', data).subscribe(res => {
          if (res.data.status = 200) {
            this.payScalelist = res.data
          }
        })

      
  }
  basicPaylist: any;
  basicpay = () => {
    let BasicPaydata = {
      "payScaleId": this.notionalIncrement.value.payScale,
      "payCommissionId": this.notionalIncrement.value.payCommission,
    }

    this.apiService.postemp('getBasicPay', BasicPaydata).subscribe(res => {
      if (res.data.status = 200) {
        this.basicPaylist = res.data;
     
      }
    })
  }

  changeSpecialPay()
  {
 
  }


  getNotionalIncrement(){
    // initialize payslip data
    this.notionalIncrementData = {};
    if (this.notionalIncrement.valid) {
      if(this.specialPay){
        if(!this.spdocumentId){
          alert("please upload special pay document");
           return
        }
      }
      if(this.isNpaDoc){
        if(!this.npadocumentId){
          alert("please upload NPA document");
           return
        }
      }
      let request={"flag":1,
        "dor":this.dor,
        "payScaleId":this.notionalIncrement.value.payScale,
        "payCommissionId":this.notionalIncrement.value.payCommission,
        "basicPayId":this.notionalIncrement.value.basicpay,
        "notionalIncdocId": this.documentId,
        "pensionerId":this.pensionerId,
        "specialPaydocId":this.spdocumentId,
        "specialPay":this.notionalIncrement.value.specialPay,
        "npaDocid":this.npadocumentId,
        "npa":this.notionalIncrement.value.npa};
        console.log("submitData",request);
       
    this.apiService.pension(request,'getNosalIncrementDetails').subscribe({
      next: (res:any) => {
        
       if(res?.data && res?.data.length > 0 && res.message !== 'No Record Found')
       {
        
          this.notionalIncrementData =  res?.data[0];
          if(res.status=="SUCCESS"){
            if(this.notionalIncrementData.vid){
            alert(this.notionalIncrementData.message+" request id = "+this.notionalIncrementData.vid)
            }
            else{
              alert(this.notionalIncrementData.message);
            }
            this.documentId=this.fileName=this.file='';
            this.notionalIncrement.reset();
            Object.keys( this.notionalIncrement.controls).forEach(key => {
              this.notionalIncrement.get(key).setErrors(null) ;
            });
            this.router.navigate(['MyDashboard']);
          }
         
       }
       else{
        this.isError = true;
       }
      },error: (err: any)=>{
        this.isError = true;
      }
    })
  }
  }

  openMonthlyPensionPDF(): void{
    const width = this.MonthlyPensionSlipToExport.nativeElement.clientWidth;
    const height = this.MonthlyPensionSlipToExport.nativeElement.clientHeight + 40;

    let orientation: any = '';
    let imageUnit: any = 'pt';

    if(width > height){
      orientation = 'l';
    }else{
      orientation = 'p';
    }

    domToImage.toPng(this.MonthlyPensionSlipToExport.nativeElement, {
      width: width,
      height: height
    })
    .then(result =>{
      let jsPdfOptions = {
        orientation : orientation,
        unit: imageUnit,
        format: [width+50, height + 220]
      }; 
      const pdf = new jsPDF(jsPdfOptions);
      let pdfName = `MonthwisePension_Slip${Math.random()}.pdf`;

      pdf.setFontSize(12.5);
      pdf.setTextColor('#2585fe');
      // pdf.text('Report date: ' + moment().format('ll'), 25, 115);
      pdf.addImage(result, 'PNG', 50,50, width, height);
      pdf.save(pdfName);
    }).catch(error =>{
      if(error)
      alert('Unable to download pdf');
    })
  }
  
selectFile(event: any,doctype:any) {
  this.file = event.target.files[0];
  let ex22: any[] = this.file.name.split(".");
  console.log("size", this.file.size / 1024)
  if (ex22[1].includes('PDF') || ex22[1].includes('pdf')) {

  } else {
    alert("Only PDF file format allowed")
    return;
  }

  if ((this.file.size / 1024) > 2048) {
    alert("Max 2 MB file size allowed")
    return;
  }
  if(!this.file)
  {
    alert("Upload sanction order.");
    return
  }
  
  let time1=new Date();
  let ex2: any[] = this.file.name.split(".");
 
  this.fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];;
  

  const formData = new FormData();

    this.nfile=this.file
    this.nfilename=this.fileName
    formData.append("file", this.file);
    formData.append("filename", this.fileName);
    this.isLoading=true;
    this.apiEssService.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
      this.isLoading=false;
        if (res.data.document[0].docId)         
        {
          this.documentId =  res.data.document[0].docId;
        alert("Document upload successfully ")
        }
  
    },(error)=>{
      this.isLoading=false;
      alert("Some Error Occured in image upload")
    })
  

 


  
}
selectfilesp(event: any,doctype:any){
  this.spfile = event.target.files[0];
  let ex22: any[] = this.spfile.name.split(".");
  console.log("size", this.spfile.size / 1024)
  if (ex22[1].includes('PDF') || ex22[1].includes('pdf')) {

  } else {
    alert("Only PDF file format allowed")
    return;
  }

  if ((this.spfile.size / 1024) > 2048) {
    alert("Max 2 MB file size allowed")
    return;
  }
  if(!this.spfile)
  {
    alert("Upload sanction order.");
    return
  }
  
  let time1=new Date();
  let ex2: any[] = this.spfile.name.split(".");
 
  this.spfileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];;
  

  const formData = new FormData();
  formData.append("file", this.spfile);
  formData.append("filename", this.spfileName);
  this.isLoading=true;
  this.apiEssService.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
    this.isLoading=false;
      if (res.data.document[0].docId)         
      {
        if(doctype=='npadoc')
        {
            this.npadocumentId=res.data.document[0].docId;
        }else if(doctype=='spdoc')
        {
          this.spdocumentId =  res.data.document[0].docId;
        }
        
      alert("Document upload successfully ")
      }

  },(error)=>{
    this.isLoading=false;
    alert("Some Error Occured in image upload")
  })
}
selectfilenpa(event: any,doctype:any){
  this.npafile = event.target.files[0];
  let ex22: any[] = this.npafile.name.split(".");
  console.log("size", this.npafile.size / 1024)
  if (ex22[1].includes('PDF') || ex22[1].includes('pdf')) {

  } else {
    alert("Only PDF file format allowed")
    return;
  }

  if ((this.npafile.size / 1024) > 2048) {
    alert("Max 2 MB file size allowed")
    return;
  }
  if(!this.npafile)
  {
    alert("Upload sanction order.");
    return
  }
  
  let time1=new Date();
  let ex2: any[] = this.npafile.name.split(".");
 
  this.npafileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];;
  

  const formData = new FormData();
  formData.append("file", this.npafile);
  formData.append("filename", this.npafileName);
  this.isLoading=true;
  this.apiEssService.postOr("wcc/uploadfile",formData).subscribe((res:any)=>{
    this.isLoading=false;
      if (res.data.document[0].docId)         
      {
        this.npadocumentId =  res.data.document[0].docId;
      alert("Document upload successfully ")
      }

  },(error)=>{
    this.isLoading=false;
    alert("Some Error Occured in image upload")
  })
}
getPayloadJson() {
 
    let   data={"empCode":this.userdetails[0].employeeCode ,'requestId':null}
    this.apiService.post('getEmployeeDetails',data).subscribe({
      next: (res:any) => {
      
           let data4 = JSON.parse(JSON.stringify(res.personalDetails).replace(/\:"null"/gi, "\:\"\""));

        
        let data=JSON.parse(data4);
        console.log("npa",data?.calculationsPensionDetails)
            this.notionalIncrement.controls['npa'].setValue(Number(data?.calculationsPayDetails?.npaOrNca))
          if(this.notionalIncrement.value.npa>0)
          {
            this.isnpa=false;
          }
            if(data?.calculationsPayDetails?.specialPay!="")
              {
                this.notionalIncrement.controls['specialPay'].setValue(Number(data?.calculationsPayDetails?.specialPay))
              }
            if(data?.calculationsPensionDetails.hasOwnProperty('specialpay'))
            {
              this.notionalIncrement.controls['specialPay'].setValue(Number(data?.calculationsPensionDetails?.specialpay))
            }
           this.maxnpa=Number(data?.calculationsPensionDetails?.basicPay)*(20/100);
           
      },
      error: (err) => {
        console.log(err);
      
      }
    })

   
  }
  changebasicpay()
  {
    let basicPay=this.basicPaylist.filter((x:any)=>x.basicPayId==this.notionalIncrement.value.basicpay)[0].basicPay;

    this.maxnpa=Number(basicPay)*(20/100);
    
  }
}


