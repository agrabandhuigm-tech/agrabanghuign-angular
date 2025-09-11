import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RedirectService } from 'src/app/services/redirect.service';
import { AppConfig } from 'src/app/app.config';
import { LoaderService } from 'src/app/services/loader.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonService } from 'src/app/services/common.service';
import { PdfDownloadServiceService } from 'src/app/services/pdf-download-service.service';
import { PdfpreviewComponent } from 'src/app/pensioner/pdfpreview/pdfpreview.component';


export interface PeriodicElement {
 // name: string;
  title: number;
  sex: string;
  symbol: string;
  imagePath: string;
  relation: string;
  main: string;
  alternate: string;
}

@Component({
  selector: 'app-essrelatedreports',
  templateUrl: './essrelatedreports.component.html',
  styleUrls: ['./essrelatedreports.component.scss']
})

export class EssrelatedreportsComponent implements OnInit { 

  jointImageUrl: any = "assets/images/jointImg.jfif";
  imageUrl: any = "assets/images/userImg.png";
  signimageUrl: any = "assets/images/signature.png";
  @ViewChild('fileInput') el!: ElementRef;
  Personaldetail: any;
  ServiceDetails: any = {};
  error: string = '';
  config: AppConfig = new AppConfig();
  ssoId:any;
  profileDetails:any;
  MartialStatus: any;
  picData:any='';
  file:any;
  fileName:any;
  uploadedDataRes:any;
  dmsDocId:any;
  documentlist:any;
  reMrriageCertificate:any;
  pensionerDtls:any;

  constructor(
      private formbuilder: FormBuilder,    
      private cd: ChangeDetectorRef,
      private _snackBar: MatSnackBar,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private ActivatedRoute: ActivatedRoute,
      private routers: Router, private http: HttpClient,   
      private redirectService: RedirectService,
      public actRoute: ActivatedRoute,
      public load: LoaderService,
      private router:Router,
      public apiService: ApiService,
      public api:ApiService,   
      public apiurl: ApiUrlService  ,  
      private dashboardService:DashboardService,
      public commonService:CommonService,
      private pdfDownloadService: PdfDownloadServiceService
  ) 
  {
        
  }

  ngOnInit(): void {  
    this.pensionerDtls= this.api.getPensionerDtls;
    //console.log("bhar gya mai>>>",this.pensionerDtls)
    let ssodata: any = localStorage.getItem('ppoDetail');
    this.ssoId =  this.config.getDecodedAccessToken(ssodata);
      console.log("Local storage idd>>>", this.ssoId),
     // console.log("Local storage idd22>>>", this.pensionerId)      
        this.dashboardService.setDashboardNav(false);
        this.dashboardService.setLoggedIn(false);
         this.getProfileDetails(); 
       
  }  
    

  getProfileDetails(){
    var url = this.apiurl.url.getprofiledetails;
    //console.log(">>>>>>>>>>>>>>>>",this.profileDetails)
    var data = {
      //"ssoId": this.profileDetails[0].ssoId,
      "ssoId": this.pensionerDtls[0].ssoId,
      "pensionerId": this.pensionerDtls[0].pensionerId     
    };
    this.api.postpension(url, data).subscribe((res: any) => {
      console.log("result>>>", res);
      this.Personaldetail=res.data[0]; 
      this.showPic(this.Personaldetail.employeePhotoGraph)
      this.jointPic(this.Personaldetail.jointPhotoGraph)
     console.log("Personaldetail Vishnu ==>>",this.Personaldetail);
       this.getbankaccountdetails();  
       this.getfamilydetails();   
       //this.getNomination();
     })    
  }
FamilydetailsView:any;
getfamilydetails(){  
    var url = this.apiurl.url.getfamilydetails;
    var data = {
      "ssoId":  this.Personaldetail.ssoId,
      "psnId": this.Personaldetail.pensionerId,   
    };
      this.api.postpension(url, data).subscribe((res: any) => {
            //console.log("result>>>", res);
            this.FamilydetailsView=res.data;      
        })    
 } 
// Family Details // //End //
// Bank Details View  // Start //
   getbankaccountdetls : any;
    getbankaccountdetails(){    
      var url = this.apiurl.url.getbankaccountdetails;
      var data = {
        "ssoId": this.Personaldetail.ssoId,
        "psnId": this.Personaldetail.pensionerId,    
        
      };
      this.api.postpension(url, data).subscribe((res: any) => {
        //console.log("result>>>", res);
        this.getbankaccountdetls=res.data[0];    
          console.log(this.getbankaccountdetls)       
      })   
    }

    // UploadReMartialStatusbyotp(){
    //   this.verifyMobileNo();  
    //    return false;  
    // }   
    
    // verifyMobileNo(): void {
    //   console.log( this.Personaldetail.mobileNumber)
    //   if(this.Personaldetail.mobileNumber)
    //   {
    //   let data={
    //     "ssoId":"RJ121212",
    //     "sourceId":"1",
    //     "processId":"18",
    //     "mobileNo": this.Personaldetail.mobileNumber,
    //     "ipAddress":"10.1.1.1"
    //   }
    //   this.apiService.postIfms('otp/otpGenerate', data).subscribe({
    //     next: res => {
    //       console.log("otp res data >>",res)
    //       this.verifyOtp(res);
    //      }
    //   })
    // }
    //   else
    //   {
    //     alert("The Employee mobile number was not found");
    //   }
    // }
    
    // verifyOtp(res:any){
    //   const confirmDialog = this.dialog.open(CommonDialogueBoxComponent, {
    //     autoFocus: false,
    //     width: '350px',
    //     data: {
    //       action: '',
    //       id: 'otp',
    //       otpData:res,
    //       mobileNo: this.Personaldetail.mobileNumber
    //     },
    //   });
    
    //   confirmDialog.afterClosed().subscribe(data => {
    //     console.log("data",data);
        
    //     if (data.verified === 'Y') {
    //       this.UploadReMartialStatus();
    //     }else{
    //       alert("The OTP (One-Time Password) was not verified")
    //     }
    //   })
    // }

    jointPic = (jointid:any) =>{
        let data = {
          "type": "pension",
          "sourceId": 2,
          "docs": [
            {
              "docId":jointid
            }
          ]
        }
        //console.log("single report data", data)
        this.apiService.postOr("wcc/getfiles", data).subscribe((res: any) => {
            if (res.data.document[0].content) {
              this.jointImageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
            }
        })
    }

    showPic = (id:any) =>{
        let data = {
          
          "type": "pension",
          "sourceId": 2,
          "docs": [
            {
              "docId":id
            }
          ]
        }
        console.log("single report data", data)
        this.apiService.postOr("wcc/getfiles", data).subscribe((res: any) => {
            //console.log("res", res.data.document[0].content);
            if (res.data.document[0].content) {
              this.imageUrl="data:image/jpeg;base64,"+res.data.document[0].content;
            }
        
        })
    }

    downloadPdfFile(): void {      
     const pdfUrl = '../assets/files/remarriage certi.pdf';
     //const pdfUrl = 'https://rajeduboard.rajasthan.gov.in/downloads/LIFE-CERTIFICATE-PENSIONERS.pdf';
     const filename = 'remarriageForm.pdf';
      this.pdfDownloadService.downloadPdf(pdfUrl, filename);
    } 

    UploadReMartialStatus(event: any) {
     //console.log(event)
      let time1 = new Date();
      this.file = event.target.files[0];
      let ex2:any[]=this.file.name.split("."); 
      //console.log("size",this.file.size/1024)
      if(ex2[1].includes('PDF') || ex2[1].includes('pdf')  )
      {
        
      } else
      {
        alert("Only PDF file format allowed")
        return;
      } 
  
      if((this.file.size/1024)>2048)
      {
        alert("Max 2 MB file size allowed")
        return;
      }   
      
      this.fileName =  "doc" + time1.getDate() + (time1.getMonth()+1) +time1.getFullYear() + time1.getHours() +time1.getMinutes() + time1.getMilliseconds().toString()+"."+ex2[1];
      this.fileName = this.fileName.replace(" ", "")
      const docTypeId = "49"
      const reader = new FileReader();
      var data4: any;
      reader.onloadend = () => {
        data4 = reader.result;
        let data5 = data4.toString()
        data5 = data5.replace("data:application/pdf;base64,", "")
        let data = {
          "type": "pension",
          "sourceId": 2,
          "docAttributes": [
  
          ],
          "data": [
            {
              "docTypeId": docTypeId,
              "docTypeName": "pdf",
              "docName": this.fileName,
              "docTitle": "Remarriage Certificate",
              "content": data5
            }
          ]
        }
        this.apiService.postOr("wcc/uploaddocs", data).subscribe((res: any) => {
            // console.log("res of uploaded doc>>>>>>>>>>>>>>>>>>>",res)
          if (res.data.document[0].docId)
            this.dmsDocId = res.data.document[0].docId; 
           
            console.log("dms Doc ID", this.dmsDocId);
            if(this.dmsDocId>0)
            {
              this.submitLifeCert();
            }
        })
      };
      reader.readAsDataURL(this.file);  
      // this.updateProgress();
    }

    submitLifeCert(){
alert()
      let uploadData={"empCode": this.Personaldetail.employeeCode,
      "psnId": parseInt( this.Personaldetail.pensionerId),
       "docitem": [
       {
         "docTypeId": 49,
         "createUid":  this.Personaldetail.pensionerId,
         "createAid": this.Personaldetail.pensionerId,
           "dmsdocid":this.dmsDocId,
           }
       ]
     }
     this.apiService.requestApplication2(uploadData,'updatephotoid').subscribe((res: any) => {
      if(res.status ='SUCCESS' && res.data.status=="Success"){
        if((res.data.msg=='Data Save Successfully')==true)
        {
          console.log("after uploade document id",res)
          alert("Marriage/Re-Marriage certificate is Uploaded !!!")
        
          //let data1 =res;
          // this.dialog.open(CommonDialogueBoxComponent,
            
          //   {data: {
          //     res: data1,
          //     Actiontype:"Success",
          //     getEventStatus: (event: any)=>{console.log(event)
          //        this.buttonEvent = event;              
          //     }
          //   },disableClose: false,            
          // });
          // this.isvisible=false;           
        }  
      }
      });  
    }
  
   
      previewFiles(){

    // alert("Response Data Is Blank that's why here don't get Doc ID .")
      console.log(this.Personaldetail.pensionerId)
      let dmsDocId=this.Personaldetail.ReMerriageCertificate;
      if(dmsDocId =this.Personaldetail.ReMerriageCertificate)
      {
      let data={
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": this.Personaldetail.ReMerriageCertificate
          }
        ]
      }
      console.log("single report data",data)
      this.api.postIntegration("wcc/getfiles",data).subscribe((res:any)=>{
        //console.log("res",res.data.document[0].content);
        if(res.data.document[0].content)
        
        {
          let data={
            "base64Pdf":res.data.document[0].content,"redirectUrl":"pensioner/pssdashboard" }
               //console.log("data",data);
           this.dialog.open(PdfpreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});           
        }
      })
    }else
    {
      alert("Preview Not Available")
    }
    }  
    
    
  }
    









