import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, MaxValidator, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AppConfig } from 'src/app/app.config';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';




import { DatePipe } from '@angular/common';

import { error } from 'console';

import moment from 'moment';
import { CommonDialogueBoxComponent } from '../../common-dialogue-box/common-dialogue-box.component';
import { CommonService } from 'src/app/services/common.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { EsignModalComponent } from '../../esign-modal/esign-modal.component';
import { PdfPreviewComponent } from '../../pension-related-request/ess/pdf-preview/pdf-preview.component';
@Component({
  selector: 'app-life-certificate',
  templateUrl: './life-certificate.component.html',
  styleUrls: ['./life-certificate.component.scss'],
  providers: [DatePipe],

})

export class LifeCertificateComponent implements OnInit {
  remark:any;
  config1 = new AppConfig();
  familyDetails: any;
  painshanDetailss: any;
  PainshanDetails: any;
  ProfileDetls: any;
  index: number = 0;

  date: Date;
  alternateSchemeList: Array<any> = [];
  FamilyRelationAlllist: Array<any> = [];
  pensionerDtls: any;
  familyDetailsData: any;
  action = '';
  userDetails: any;
  LifeCertifict!: FormGroup;
  formGroup !: FormGroup;
  Summary !: FormGroup;
  serachingKey: any;
  imageUrl: any = "assets/images/userImg.png";
  picData: any = '';
  dmsDocId: any;
  isvisible: boolean = false;
  isvisible2: boolean = false;
  iseSin: boolean = false;
  empinfo: any = {};
  ButtonView: any = "Generate"
  resultLife: any;
  extractAccNo: string;
  lrResult:any;
  constructor(private formbuilder: FormBuilder,
    public load: LoaderService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    private essService: ApiService,
    public routers: Router,
    public actRoute: ActivatedRoute,
    public redirectService: RedirectService,
    private datePipe: DatePipe,
    private common:CommonService
  ) {
    this.date = new Date();
    this.essService.configMenu = { IsShow: true }
  }
  ngOnInit(): void {
    this.essService.configMenu = { IsShow: true }

    this.empinfo = this.essService.userInfo();
    console.log("emptoken", this.empinfo);
    this.userDetails = this.config1.getUserDetails();
    this.actRoute.queryParams.subscribe(params => {
      var esignRes = params['status'];
      var msg = params['message'];
      var id = params['id'];
      if (esignRes) {
        if (id) {
          this.getEsignData(id);
        }
      }

      var id2 = params['esignId'];
      var docId = params['docId'];
      // console.log("esignRes",docId)
      // if (esignRes=="success" && Number(docId)>0 && id2 ) {
       

      //     this.getEsignDetails(id2,docId);

        
      // }else if(msg.includes('AadhaarName_is_Not_valid'))
      // {    
      //   this.common.openErrorModal("Name mismatch: The name in your Aadhaar data does not match the name in your SSO data.","");
      //   this.routers.navigate(['ess/profileUpdate/lifeCertificateDetail']);
      // }
      // else{
      //   this.common.openErrorModal(msg,"");
      // }

   
    });
    console.log(" deatials leke aa>>>>----", this.userDetails)
    this.LifeCertifict = this.formbuilder.group({
      ppoNumber: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
    });
this.getLoginEmpDetails();
  }
  getEsignDetails(id:any,docId:any)
  {
   let data2={
     "esignId": id
 }
   this.load.show()
   this.essService.postNewEsign("v3/getEsignDetails",data2).subscribe((res:any)=>{
 
     this.load.hide()
    
     if(JSON.stringify(res).includes('ESignId'))
       {
        console.log("docId",docId);
      
        let data=JSON.parse(res)
         this.esignData=data.data
         console.log("EsignData",this.esignData);
         this.submitAfterEsign(docId);
       }else
       {
         this.common.openErrorModal("due to some technical issue document not update.","");
       }
     
     },(error)=>{
       this.load.hide()
       this.common.openErrorModal("due to some technical issue document not update.","");
     })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("Searching key is>>>>---", filterValue)
    this.serachingKey = filterValue;
  }
  esignData: any;
  dialogData:any;
  getEsignData(id: any) {
    let data = {
      "trxnNo": id,
      "databaseKey": "3"
    }
    let url = "esignTransaction";
    this.essService.postNewEsign(url, data).subscribe((res: any) => {
      this.esignData = JSON.parse(res);
      
      if (this.esignData.responseStatus == '1' && Number(this.esignData.docId)>0) {

        this.submitAfterEsign(this.esignData.docId);
        // this.dialogData = {
        //   "esignRes": "SUCCESS",
        //   "transId": id,
        //   "redirectUrl": "ess/Inbox",
        //   "bill": "0"
        // }
      } else {
        this.dialogData = {
          "esignRes": "failed",
          "type": "",
          "redirectUrl": "ess/Inbox",
        }
        setTimeout(()=>{
          this.dialog.open(EsignModalComponent, { panelClass: 'dialog-w-30', data: { message: this.dialogData } }).afterClosed().subscribe(data => {
            console.log("data",data);
            this.routers.navigate(['life-certificate/lifeCertificateDetail'])
          });
        },1000)
      }
       
        
     
      //console.log("esignData", this.esignData);
    })
  }
  getDocumentFile = (id: any) => {
    let data = {
      "type": "data",
      "sourceId": 2,
      "docs": [
        {
          "docId": id
        }
      ]
    }
    console.log("single report data", data)
    this.load.show();
    this.essService.postIntegration('wccv2/getfiles', data).subscribe({
      next: res => {
        this.load.hide();

        console.log("res", res.data.document[0].docName)
 
        console.log("file exeeee", res.data.document[0].content);
        let mainData:any =  "data:application/pdf;base64," + res.data.document[0].content;
        console.log("mainData", mainData)
        let data = {
          "base64Pdf": mainData,
          "redirectUrl": "/ess/profileUpdate/lifeOtherCertificate",
        }
        console.log("data", data);
        this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false }).afterClosed().subscribe(data => {
         
          this.routers.navigate(['life-certificate/lifeCertificateDetail'])
        });

      }, error: err => {
        this.load.hide();
        this.snackbar.show(err.error.description, 'danger')
      }
    })
  }
  isalready:boolean=false
  checkLifeCertificate()
  {
    let data={"inMstType":26,
      "ppoNo":this.LifeCertifict.controls['ppoNumber'].value,
      "accNo":this.LifeCertifict.controls['accountNumber'].value
    }
    this.essService.pension(data,"workMultiTask").subscribe((res:any)=>{
      console.log(res)
    this.load.hide();

      if(res?.data)
      {
      if(JSON.stringify(res).includes('ppoNo'))
      {
          let data=JSON.parse(res.data);   
          console.log("data",data);      
          if(data[0].ppoNo!='0')
            {
                    
                 let msg="Life Certificate of "+this.LifeCertifict.controls['ppoNumber'].value.toString()+" already generated at IFMS Pension 3.0.Valid till "+data[0].validUpTo;
                 this.common.openErrorModal(msg,"")
                  this.isalready=true;
              
              
            }  else
            {
              this. getLifeCertifictdetails();
            }
        
      }}else{
        this. getLifeCertifictdetails();
      }
   
    },(error)=>{
      this.load.hide();
    })
    var url = 'life/getLifeCertificateData';
    var dataa =
    {
      "endPoint":"GetLifeCertificateData",
      "param": {
          "PpoNo": this.LifeCertifict.controls['ppoNumber'].value.toString(),
          "AcNo": this.LifeCertifict.controls['accountNumber'].value.toString(),
          "Type":1,
          "MobNo":0,
          "lid":'0',
          'dmsdocid':'0'
      }
  }
 
  // if(!this.isalready)
  //   {
  //   this.load.show();
 
  //     this.essService.postIntegration( url,dataa).subscribe((res: any) => {
  //       console.log("result", res)
  //       this.load.hide();
  //       if(res?.IsSuccess==1 && res?.PensionerData[0]?.IsLc=='Y')
  //       {
  //     this.essService.postIntegration( url,dataa).subscribe((res: any) => {
  //       console.log("result", res)
  //       this.load.hide();
  //       if(res?.IsSuccess==1 && res?.PensionerData[0]?.IsLc=='Y')
  //       {
         
              
  //         let date=new Date();
  //         let c=moment(date, 'DD-MM-YYYY');
  //         c.toDate();        
         
  //         let validateDate = moment(res?.PensionerData[0]?.ValidUpToDt, 'DD-MM-YYYY').subtract(1, 'months');
  //         validateDate=moment(validateDate, 'DD-MM-YYYY').add(1, 'days'); 
  //         let validate = moment(validateDate, 'DD-MM-YYYY');
  //         validate.toDate();
  //         if(validate>=c)
  //         {
  //           let msg="Life Certificate of "+this.LifeCertifict.controls['ppoNumber'].value.toString()+" already generated at IFMS Pension 2.0.Valid till "+res?.PensionerData[0]?.ValidUpToDt;
  //           this.common.openErrorModal(msg,"");
  //         let validateDate = moment(res?.PensionerData[0]?.ValidUpToDt, 'DD-MM-YYYY').subtract(1, 'months');
  //         validateDate=moment(validateDate, 'DD-MM-YYYY').add(1, 'days'); 
  //         let validate = moment(validateDate, 'DD-MM-YYYY');
  //         validate.toDate();
  //         if(validate>=c)
  //         {
  //           let msg="Life Certificate of "+this.LifeCertifict.controls['ppoNumber'].value.toString()+" already generated at IFMS Pension 2.0.Valid till "+res?.PensionerData[0]?.ValidUpToDt;
  //           this.common.openErrorModal(msg,"");
          
  //           this.isalready=true
  //         }else
  //         {
  //           this. getLifeCertifictdetails();
  //         }
  //       }else
  //       {
  //         this.getLifeCertifictdetails();
  //       }
  //     //  this.getIFMS2LR();
  //     this.load.hide();
  //           this.isalready=true
  //     }else
  //         {
  //           this. getLifeCertifictdetails();
  //         }
  //     })
  //       }else
  //       {
  //         this.getLifeCertifictdetails();
  //       }
  //     //  this.getIFMS2LR();
        
  //     this.load.hide();
      
  //     },(error)=>{
  //       this.load.hide();
  //     })
  //   }
     

  
  }
  // Get PPO Details List  //
  getLifeCertifictdetails() {
    this.isvisible = false;
    this.isvisible2 = false;
    if (this.LifeCertifict.valid) {
      console.log(this.serachingKey)
      var url = 'getPensionLifeCertificate';
      var data =
      {
        "ppoNo": this.LifeCertifict.controls['ppoNumber'].value.toString(),
        "accountNo": this.LifeCertifict.controls['accountNumber'].value.toString(),
        "pensionerId":0
      };
      this.load.show();
      this.essService.pension(data, url).subscribe((res: any) => {
        this.load.hide();
 
        console.log("result>>>", res);
        this.PainshanDetails = res.data;

       console.log("this.PainshanDetails",this.PainshanDetails)
        if (res.data[0].msg=="no data available") {
          this.getLifeCertIfms2();
        }
        else  {
          this.getProfileDdetails();
          this.isvisible = true;
          
          
        }
        // else {
        //   console.log(res.data.msg);
        // }
        console.log("Family details ka Data Lao londee >>>>", this.PainshanDetails)
      },(error)=>{
        this.load.hide();
      })
    }
  }

  getLifeCertIfms2() {
    var url = 'life/getLifeCertificateDtl';
    var dataa =
    {
      "UserID": 'ifms30',
      "Password": '$r04QM-yF8',
      "PPONumber": this.LifeCertifict.controls['ppoNumber'].value.toString(),
      "BankAcNo": this.LifeCertifict.controls['accountNumber'].value.toString()
    };
    this.load.show();
    this.essService.postIntegration( url,dataa).subscribe((res: any) => {
      console.log("result", res)
    //  this.getIFMS2LR();
    this.load.hide();
      if(res.data.Status=='Success')
      {
      
      if (res.data.data) {
        // this.getProfileDdetails();
        this.isvisible2 = true;
        this.painshanDetailss = res?.data?.data;
        this.extractAccNo = this.extractLastFourDigits(this.painshanDetailss?.BankAcNo);
        this.showPic(this.painshanDetailss.EmployeePhotograph)
        console.log("this.PainshanDetails", this.painshanDetailss)
        let dateLife=this.painshanDetailss.LastLifeCertificateDate;
        var currentYear = new Date();
   
        var arr =  dateLife.split('-');
       // Convertted in MM/DD/YYYY format
       var Date1= new Date(arr[1]+'/'+arr[0]+'/'+arr[2]); 
       var date2 = new Date('10/31/'+currentYear.getFullYear());
       if(Date1 > date2){
       //alert('date1 is greater visible');
       alert("This PPO No Certificate is already generated on IFPMS 2.0 on date :"+this.painshanDetailss.LastLifeCertificateDate);
       this.isvisible2 = false;
        }
        else{
          //alert('date2 is greater hide');
     
          this.isvisible2 = true;
        }

        // if(this.painshanDetailss.LifeCertificateStatus=="Y")
        // {
        //   alert("This PPO No Certificate is already generated on IFPMS 2.0 on date :"+this.painshanDetailss.LastLifeCertificateDate);
        //   this.isvisible2 = false;
        // }
        // console.log("data aya aya",res.data)
      }
    }

    else if(res.status=="FAILURE")
      {
        this.load.hide();
        alert("Currently service is down.Please try again later");
        this.load.hide();
      }
      else{
        alert(res.data.Status);
        this.load.hide();
       }
    },(error)=>{
      this.load.hide();
    })

  }


//   getIFMS2LR() {
//   // this.ProfileDetls.employeeCode;
//   // this.painshanDetailss.EmployeeID;
//   // if (this.ProfileDetls.employeeCode !== null || this.painshanDetailss.EmployeeID !== null) {
//   //   }
//   var url = 'life/getLrStatus';
//    var dataa =
//     {
//      UserID:'ifms30',
//       Password:'$r04QM-yF8',
//       EmployeeId: this.empinfo?.employeeId ? this.empinfo?.employeeId :0,
//      };
//      this.essService.postIntegration(url,dataa).subscribe((res: any) => {
//       if(res.data=="N")
//       {
//         alert("LR NOT GENERATED ")
//         this.isvisible2 = false;
//       }
//       // this.lrResult=res
//     })
//  }



// Get PPO Details List  //  End   //

  // View Details Used By Psn_ID  Satart // 
  View = (index: number) => {
    this.index = index;
    const data = this.PainshanDetails[index];
    console.log("asda", data)
  }

  ///  Get Profile Details By Peinshan_Id // Start //  
  getProfileDdetails() {
    console.log("Profile details ka Data Lao londee >>>>", this.PainshanDetails[0].pensionerId)
    var url = 'getPensionLifeCertificate';
    var data = 
    
    
    { 
      "ppoNo": 0,
      "accountNo": 0,
      "pensionerId": this.PainshanDetails[0].pensionerId, };
      this.load.show();
    this.essService.pension(data, url).subscribe((res: any) => {
      this.load.hide();
    
    
      this.ProfileDetls = res.data[0];
     
      console.log("result>>>", this.ProfileDetls);
      this.showPic(this.ProfileDetls?.employeePhotoGraph);
    
     
      console.log("result>>>", this.ProfileDetls);
      this.showPic(this.ProfileDetls?.employeePhotoGraph);
    
      console.log("Profile details >>>>", this.ProfileDetls)
      console.log("Profile details >>>>", this.isvisible)
      console.log("Profile details >>>>", this.isalready)
    },(error)=>{
      this.load.hide();
    })
  }
  ///  Get Profile Details By Peinshan_Id // End  //  
showPic = (id: any) => {
    let data = {
      "type": "pension",
      "sourceId": 2,
      "docs": [
        {
          "docId": id
        }
      ]
    }
    console.log("single report data", data)
    this.load.show();
    this.essService.postOr("wccv2/getfiles", data).subscribe((res: any) => {
      this.load.hide();
      //console.log("res", res.data.document[0].content);
      if (res?.data?.document[0]?.content) {
      if (res?.data?.document[0]?.content) {
        this.imageUrl = "data:image/jpeg;base64," + res.data.document[0].content;
      }
    }
    },(error)=>{
      this.load.hide();
    })
  }
  saveAndGenrate() {
    // if(this.remark==null)
    // {
    //   this.common.openErrorModal("Please enter remark.",'');
    //   return;
    // }
    var url = 'approvePssLifeCertificate';
    let data = null;
    if ( this.PainshanDetails.length > 0 && this.PainshanDetails[0].msg!="no data available") {
      data = {
        "regData": {
          "pensionerId":this.PainshanDetails[0].pensionerId,
          "officeAssignmentId": 0,
          "officerOfficeId": this.empinfo.userId ? this.empinfo.userId : 0,
          "dmsDocId": 0,
          "ppoNo": this.ProfileDetls.ppoNo,
          "docTypeId": 0,
          "empCode": this.ProfileDetls.employeeCode,
          "name": this.ProfileDetls.employeeName,
          "address": this.ProfileDetls.currentAddress,
          "accountNo": this.LifeCertifict.controls['accountNumber'].value.toString(),
          "gender": this.ProfileDetls?.gender,
          "maritalStatus": this.ProfileDetls?.maritalStatus,
          "nameTitle": "NA",
          "mobNo": this.ProfileDetls?.mobileNumber ? this.ProfileDetls?.mobileNumber:0,
          "lcStatus":'Y',
          "vIfmsV":"3", 
          "ssoId": this.empinfo.ssoId,
          "dsgn":this.loginDetails?.currentDesignationName
        }
      }
      this.load.show();
      this.essService.pension(data, url).subscribe((res: any) => {
        this.load.hide();
        console.log("result>>>", res);
        this.resultLife = JSON.parse(res.data);
        this.config1.storeDetails("lid", this.resultLife.lifeCertId);
        if (this.resultLife.dmDocId != 0) {
          this.getDocumentFile(this.resultLife.dmDocId);
        }
        //this.updateDocTable(this.esignData.docId,this.resultLife.lifeCertId)
        else {
          this.getLifeCertifictById(1);
        }
      },(error)=>{
        this.load.hide();
      });
    }
    else {
      data = {
        "regData": {
          "pensionerId": 0,
          "officeAssignmentId": 0,
          "officerOfficeId":  this.empinfo.userId ? this.empinfo.userId : 0,
          "dmsDocId": 0,
          "ppoNo": this.painshanDetailss.PPONumber,
          "docTypeId": 0,
          "empCode": this.painshanDetailss.EmployeeID,
          "name": this.painshanDetailss.EmployeeName,
          "address": this.painshanDetailss.CurrentAddress,
          "accountNo":  this.extractAccNo,
          "gender": this.painshanDetailss?.Gender,
          "maritalStatus": "NA",
          "nameTitle": "NA",
          "mobNo":this.painshanDetailss?.MobileNo? this.painshanDetailss?.MobileNo : 0,
           "lcStatus":'Y',
           "vIfmsV":"2",
           "ssoId": this.empinfo.ssoId,
           "dsgn":this.loginDetails?.currentDesignationName
        }
      }
      this.load.show();
      this.essService.pension(data, url).subscribe((res: any) => {
        this.load.hide();
        console.log("result>>>", res);
        this.resultLife = JSON.parse(res.data);
        this.config1.storeDetails("lid", this.resultLife.lifeCertId);
        console.log("this.resultLife>>>>>>>>>>>", this.resultLife)
        if (this.resultLife.dmDocId != 0) {
          this.getDocumentFile(this.resultLife.dmDocId);
        }
        else {
          this.getLifeCertifictById(1);
        }
      },(error)=>
      {
        this.load.hide();
      });

    }

  }


  // Get Certificate by Painshan Id Fiste // Start //
  getLifeCertifictById(i:any) {

    let path = "/Pension/Life_Certificate/Report/Life_Cert_RPT.xdo";
    let data = {
      "reportPath": path,
      "format": "pdf",
      "params": [
        {
          "name": 'LIFE_CERT_ID',
          "value": this.resultLife.lifeCertId
        }
      ]
    }
    this.load.show();
    this.essService.postIntegration("report/singlereport", data).subscribe((res: any) => {
      console.log("res abe dikha janaa tuu", res);
      this.load.hide();
      if (res.data.report.content) {
      ;
        if(i==1)
        {
          let data = {
            "base64Pdf": "data:application/pdf;base64," +res.data.report.content,
            "redirectUrl": "pension/pss/LifeOtherCertificate"
          }
          console.log("data", data)
          this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
          this.iseSin = true;
          this.ButtonView = "Preview"
        }else if(i==2)
        {
          let time1=new Date();
          let docName="doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
  let data={
              "docname":docName,
              "trxn":this.esignTransId,
              "file":res.data.report.content
            }
            console.log("data",data);
            this.getesignDocId(data);
        }
       
      }
    },(error)=>
    {
      this.load.hide();
      alert("Some Error Occured.")
    })
  }
getesignDocId(data1:any)
{
  let docName=data1.docname;
  this.load.show();
  this.essService.postNewEsign("esigndocu",data1).subscribe((res:any)=>{
    this.load.hide();
    console.log("res",res)
    res=JSON.parse(res);
    let data=JSON.parse(res.data);
    if(data?.Document)
    {
      console.log("res",data.Document)
      this.documentUpload(data.Document,docName)
      let data1 = {
        "base64Pdf": data.Document,
        "redirectUrl": "pension/pss/LifeOtherCertificate"
      }
      
      console.log("data", data1)
      this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data1 }, disableClose: false });
     this.routers.navigate(['ess/profileUpdate/lifeCertificateDetail'])
    }
    
  
  },(error)=>{
    this.load.hide();
    alert("Some Error occured.")
  })
}
  pkEsignData(arg0: string, pkEsignData: any) {
    throw new Error('Method not implemented.');
  }
 
esignRequest() {
    let time1 = new Date();
    let purl: string = this.routers['location']._platformLocation.location.origin;
    let fileName = "life" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
    let mainUrl = purl + "/ifmspss/#/life-certificate/lifeOtherCertificate";
    let data = {
      "reportPath": "/Pension/Life_Certificate/Report/Life_Cert_RPT.xdo",
      "name": "LIFE_CERT_ID",
      "value": this.resultLife.lifeCertId,
      "url": mainUrl,
      "contextPath": "3",
      "cordX": 800,
      "cordY": 35,
      "assignmentId": 90402,
      "docTypeId": "281",
      "docName": fileName,
      "roleId": "6",
      "requestId": this.LifeCertifict.controls['ppoNumber'].value.toString(),
      "processId":'0'
    }
    console.log("esignXmlRequest", data);
    let url = "sendrequest";
    this.load.show();
    this.essService.postNewEsign(url, data).subscribe((res: any) => {
      console.log("res", res);
      this.load.hide();
    
        this.Submitlifecertificate();

     

      setTimeout(() => {
        this.redirectService.postRedirect(res);
      }, 600);
    }, (error) => {
      this.load.hide();
      alert("Error in E-Sign Service.Please try after some time.")
    })
  }
  esignRequest2() {
    if(this.empinfo?.aadhaarId)
    {
      let data:any
      if(this.empinfo?.aadhaarId.toString().length>12) 
      {
       console.log("aadhaar1",this.empinfo?.aadhaarId);
       let data2={
        "refNo":this.empinfo?.aadhaarId
        }
        this.load.show();
        this.essService.postIfms("aadhaar/detokenization",data2).subscribe((res:any)=>{
          this.load.hide();
          console.log("res",res?.DSMTokanize?.AadhaarNo)
          if(res?.DSMTokanize?.AadhaarNo)
          {
            data={
              "aadharid":res.DSMTokanize.AadhaarNo,
              "departmentname":"IFMS"
            }
            this.otpVerify(data)
          }
          
        },(error)=>{
          this.load.hide();
      alert("Some Error occured.")
    })
      }else
      {
       console.log("aadhaar2",this.empinfo?.aadhaarId);
       data={
        "aadharid":this.empinfo?.aadhaarId,
        "departmentname":"IFMS"
      }
      this.otpVerify(data)
      }
     
    }
    // let data={
    //   "aadharid":"737459660391",
    //   "departmentname":"IFMS"
    // }
// this.otpVerify(data)
  }
  esignTransId:any
  otpVerify(data:any)
  {
    this.load.show();
    this.essService.postNewEsign("otpesign",data).subscribe((res:any)=>{
      this.load.hide();
      console.log("res",res)
      res=JSON.parse(res);
      let data=JSON.parse(res.data);
      console.log("res",data?.TransactionId)
      if(data?.TransactionId)
      {
      //   const confirmDialog = this.dialog.open(CommonModalComponent, {
      //     autoFocus: false,
      //     width: '350px',
      //     data: {
      //       action: '',
      //       id: 'otp2',
      //       otpData:res,
      //       tranId:data?.TransactionId
      //     },
      //   });
      //  confirmDialog.afterClosed().subscribe(data => {
      //     console.log("data",data);
      //     if (data=== 'F') {
      //       alert("The OTP (One-Time Password) was not verified")
      //     }else{
      //       this.esignTransId=data;
      //       this.getLifeCertifictById(2);
      //     }
      //   })
      }
    },(error)=>{
      this.load.hide();
      alert("Some Error occured.")
    })
  }
  config: AppConfig = new AppConfig();
  Submitlifecertificate() {

  
  
    let uploadData = null;
    if (this.ProfileDetls) {

      uploadData = {
        "lid":this.resultLife.lifeCertId,
        "empCode": this.ProfileDetls.employeeCode,
        "psnId": Number(this.ProfileDetls.pensionerId),
        "ppoNo":this.LifeCertifict.controls['ppoNumber'].value,
        "mobileNo":this.ProfileDetls.mobileNumber,
        "accNo":this.LifeCertifict.controls['accountNumber'].value,
        'remark':this.remark?this.remark:" ",
        "docitem": [
          {
            "docTypeId": 281,
            "createUid": this.empinfo.userId ? this.empinfo.userId : 0,
            "createAid": this.empinfo.userId ? this.empinfo.userId : 0,
            "dmsdocid": 0,
          }
        ]
      }
    }
    else {

      uploadData = {
        "lid":this.resultLife.lifeCertId,
        "empCode": this.painshanDetailss.EmployeeID,
        "psnId": Number(this.painshanDetailss.PPONumber),
        'remark':this.remark?this.remark:" ",
        "ppoNo":this.LifeCertifict.controls['ppoNumber'].value,
        "accNo":this.LifeCertifict.controls['accountNumber'].value,
        "mobileNo":this.painshanDetailss?.MobileNo,        
        // "mobileNo":this.ProfileDetls.MobileNo,        
        "docitem": [
          {
            "docTypeId": 281,
            "createUid": this.empinfo?.employeeId ? this.empinfo?.employeeId : 0,
            "createAid": this.empinfo?.employeeId ? this.empinfo?.employeeId : 0,
            "dmsdocid": 0,
          }
        ]
      }

    }

    console.log("uploadData ", uploadData)

    this.storeDetails("lifeSubmitData", JSON.stringify(uploadData));
    
    this.storeDetails("lifeSubmitData", JSON.stringify(uploadData));
    
    this.load.hide();
      // this.esignRequest2();
 
  }
  uploadData:any;
  esignDocId:any;

  submitAfterEsign(docId: any) {
   debugger
this.esignDocId=docId;
    this.uploadData = JSON.parse(this.getDetails('lifeSubmitData'));
    console.log("lifeSubmitData2",this.uploadData.ppoNo);
    console.log("esignData2", this.esignData.requestId);
    if(this.uploadData.ppoNo==Number(this.esignData.requestId))
    {
      this.updateDocTable(docId,this.uploadData.lid,this.uploadData?.remark);
      this.getDocumentFile(docId);
    }else
    {
      this.common.openErrorModal("Some Error in upload.Please try again.","")
    }
   
    
  }
  updateDocTable(docId: any, lifeId: any,remark:any) {
    let data = {
      "dmsDocId": docId,
      "lifeCertifId": lifeId,
      "remark":remark
    }
    this.essService.pension(data, 'updatePssLifeCertificate').subscribe((res: any) => {
      console.log("res", res);
      this.storeDetails("lifeSubmitData", '');
      this.storeDetails("lifeSubmitData", '');
      this.updateDetailsOnIFMS2_0();
      this.sendSMS();
    },(error)=>
    {
      alert("error in update doc id")
    })
  }

  extractLastFourDigits(input: string): string {
    if (input.length >= 4) {
      return input.slice(-4);
    } else {
      return input;
    }
  }

  documentUpload(base64:any,docName:any)
  {
let data={
  "type": "pdf",
  "sourceId": 3,
  "docAttributes": [
     
  ],
  "data": [
      {
          "docTypeId": 281,
          "docTypeName": "pdf",
          "docName": docName,
          "docTitle": docName,
          "content": base64
      }
  ]
}
console.log("data",data);
this.load.show();
this.essService.postIfms("wcc/uploaddocs",data).subscribe((res:any)=>{
  this.load.hide();
  console.log("res",res);
  if(res.status!="F")
  {
    if (res.data?.document[0]?.docId) {
    
      //  this.submitEmployeeDe()
      this.updateDocTable(res.data.document[0].docId,this.resultLife.lifeCertId,"");
     } else {
       alert("Some error occured.")
     }
  }else
  {
    alert("Some error occured.")
  }
 
},(error)=>{
  this.load.hide();
  alert("Some error occured.")
})
  }
  getNextOctober31(): Date {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let targetYear = currentYear;
  
    // Check if 31st October has already passed this year
    const october31 = new Date(currentYear, 9, 31); // 9 is October (months are 0-indexed)
  
    if (currentDate > october31) {
      // If current date is past October 31, get next year's October 31
      targetYear += 1;
    }
  
    // Return the next October 31st
    return new Date(targetYear, 9, 31); // 9 is October
  }
  updateDetailsOnIFMS2_0()
  {
    var url = 'life/getLifeCertificateData';
    var dataa =
    {
      "endPoint":"GetLifeCertificateData",
      "param": {
          "PpoNo": this.esignData.requestId,
          "AcNo": this.uploadData.accNo,
          "MobNo":0,
          "Type":2,
          "lid":this.uploadData.lid.toString(),
          'dmsdocid':this.esignDocId.toString()
      }
  }
  console.log("data",dataa);
  let mainUrl:string=window.location.origin
if(mainUrl.includes('https://ifms.rajasthan.gov.in')){
  this.essService.postIntegration( url,dataa).subscribe((res: any) => {});
}
var url = 'life/getLifeCertificateData';
var dataa2 =
{
  "endPoint":"GetLifeCertificateData",
  "param": {
      "PpoNo": this.esignData.requestId,
      "AcNo": this.uploadData.accNo,
      "MobNo":this.uploadData.mobileNo,
      "Type":3,
      "lid":'0',
      'dmsdocid':'0'
  }
}
console.log("data",dataa);
setTimeout(()=>{
  this.routers.navigate(['ess/profileUpdate/lifeCertificateDetail']);
},2000)
this.essService.postIntegration( url,dataa2).subscribe((res: any) => {});

      
  }
  sendSMS()
  {
//     let currentDate=new Date();
//     let msg="Your Life Certificate for PPO No. "+this.uploadData.ppoNo+" has been updated on "+currentDate+"  - Rajpension"
//   let data={
//     "language":"ENG",
//     "message":msg,
//     "mobList":this.uploadData.mobileNo,
//     "templateId":"1007908312001971580",
//     "msgType":"SMS"
// }
//   console.log("data",data);
//   this.essService.postIntegration( "esanchaar/sendsmsotp",data).subscribe((res: any) => {});
  }
  loginDetails:any={
    currentDesignationName:" "
  };
  getLoginEmpDetails()
  {
  this.essService.postmst('getEmployeeDetailsByType', {
    employeeId: this.empinfo.employeeId, inType: 8
  }).subscribe((res:any)=>{
    if(JSON.stringify(res).includes("currentDesignationName"))
    {
      this.loginDetails=res.data.employeeOtherDetails[0];
      console.log("login data",this.loginDetails);
    }
   
  })
}
newEsignRequest()
{
  let time1 = new Date();
  let purl: string = this.routers['location']._platformLocation.location.origin;
  let fileName = "life" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
  let mainUrl = purl + "/ifmspss/#/life-certificate/lifeOtherCertificate";
 let data4={ 
  "reportPath": "/Pension/Life_Certificate/Report/Life_Cert_RPT.xdo",
  "returnUrl": mainUrl,
  "esignType":0,
  "docProcMapId":540,
  "docName":fileName,
  "preDocId":"0",
  "requestID":this.LifeCertifict.controls['ppoNumber'].value,
  "param": [
      {
          "name": "LIFE_CERT_ID",
          "value": this.resultLife.lifeCertId
      }
  ]

}



console.log("EsignData",data4);
this.common.openConfirmModal("Please ensure that the name in SSOID matches the name on the Aadhaar card before proceeding with E-Sign.",()=>{
  this.load.show()
  this.essService.postNewEsign("v3/requestesign",data4).subscribe((res:any)=>{
    this.load.hide()
    if(JSON.stringify(res).includes('esignId'))
    {
      let data=JSON.parse(res)
     
      data=JSON.parse(data.data)
   
      let data2={
        "esignId": data.esignId
    }
    this.load.show()
    this.essService.postNewEsign("v3/getEsignDetails",data2).subscribe((res:any)=>{
      console.log("EsignData",res)
      this.load.hide()
      if(JSON.stringify(res).includes('ESignId'))
        {
          let data=JSON.parse(res)
          console.log(data);
          
         let data3= {
            "esignId": data.data.ESignId,
            "cordX": 800,
            "cordY": 30
        }
        this.load.show()
        this.essService.postNewEsign("v3/generateEsign",data3).subscribe((res:any)=>{
          // console.log(res)
          this.load.hide();
          if(JSON.stringify(res).includes('xml'))
          {
            console.log(res)
            let data=JSON.parse(res);
            console.log(data)
            this.Submitlifecertificate();
            setTimeout(() => {
              this.redirectService.postRedirect(data.data);
            }, 300);
          }else{
            alert(JSON.stringify(res))
          }
         
        },(error)=>{
          this.load.hide();
          alert("Esign Service have error")
        });
        }else{
          alert("Esign Service have error")
        }
    },(error)=>{
      this.load.hide();
      alert("Esign Service have error")
    });
    }else{
      alert("Esign Service have error")
    }
  
  },(error)=>{
    this.load.hide();
    alert("Esign Service have error")
  })
})


}
storeDetails(key:any,Details:any)
{
  let enuser:any=this.config1.encrypt(Details);
  localStorage.setItem(key,enuser);
}
getDetails(key:any)
{
  var enData:any=localStorage.getItem(key);
  if(enData){
  var dyuser:any=this.config1.decrypt(enData);
 
  }
  return dyuser;
}
}












