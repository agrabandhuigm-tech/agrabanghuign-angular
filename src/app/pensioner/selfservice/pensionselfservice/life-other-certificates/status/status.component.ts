import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import {CommonDialogueBoxComponent} from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
//import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { PdfDownloadServiceService } from 'src/app/services/pdf-download-service.service';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from 'src/app/services/loader.service';
import { error } from 'console';
import { DashboardService } from 'src/app/services/dashboard.service';




export interface PeriodicElement {
  name: string;
  position: number;
  year:string;
  //weight: number;
  symbol: string;
  Action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'H', Action: 'Ne'},
  {position: 2, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'He', Action: 'Ne'},
  {position: 3, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'Li', Action: 'Ne'},
  {position: 4, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'Be', Action: 'Ne'},
  {position: 5, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'B', Action: 'Ne'},
  {position: 6, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'C', Action: 'Ne'},
  {position: 7, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'N', Action: 'Ne'},
  {position: 8, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'O', Action: 'Ne'},
  {position: 9, year: '2022-2023', name: 'Ruhi Sharma', symbol: 'F', Action: 'Ne'},
  {position: 10, year: '2022-2023', name: 'Ruhi Sharma', symbol:'Ne', Action: 'Ne'},
];



@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  config: AppConfig = new AppConfig();
  
  displayedColumns: string[] = ['position', 'year', 'name', 'symbol', 'action'];
  dataSource = ELEMENT_DATA;
  imageUrl: any = "assets/images/userImg.png";

  editFile: boolean = true;
  file:any;
  fileName:any;
  removeUpload: boolean = false;
  uploadData:any;
  PensionerDetails:any;
  userDetails:any;
  ppoInfo:any;
  uploadedDataRes:any;
  dmsDocId:any;
  imageString:any;
  buttonEvent: any;
  isvisible:boolean=true;
  profileInfo:any;
  profileDetailsObj:any;
  
  

  constructor(private cd: ChangeDetectorRef,
    public apiService: ApiService,
    public commonService: CommonService, 
     public dialog: MatDialog,
     private route: ActivatedRoute,
     private http: HttpClient,
     private pdfDownloadService: PdfDownloadServiceService,
     private loader: LoaderService,
     private dashboardService:DashboardService,

     ) { }

  ngOnInit(): void {
   
    //this.showPic(this.ppoInfo.lifeCertificateId);
    this.dashboardService.setDashboardNav(false);
    this.dashboardService.setLoggedIn(false);
    
    this.commonService.personalProfileDetails.subscribe((res:any)=>{
      this.profileInfo = res
     

     if( this.profileInfo ){
        let decDetails = this.config.decrypt(this.profileInfo);
      
         if(decDetails !== null)
         {
          this.profileDetailsObj =  JSON.parse(decDetails);
          this.ppoInfo= this.profileDetailsObj[0]
          console.log("Mobile n0 hai...",this.ppoInfo.mobileNumber)
          if(this.ppoInfo.lifeCertificateId > 0){
            this.showPic(this.ppoInfo.lifeCertificateId);
          }
         }
         console.log( this.profileDetailsObj)    

      }     
     })

   

    // this.jointPic(this.empDetails.personalDetails.jointPhotoId);
  
   // let item = localStorage.getItem('profileDetails');
   // this.profileInfo =  this.config.decrypt(['profileDetails']); 
    // console.log(this.profileInfo)
    // if (item !== null) {
    //   const profileDetailsObj = JSON.parse(item);
    //   this.ppoInfo=profileDetailsObj[0];
      
    //}    
  }

  downloadPdfFile(): void {
    //const pdfUrl = 'file:///C:/Users/Dell/Downloads/life%20cert.pdf'; // Replace with your PDF URL
   const pdfUrl = '../assets/files/life cert.pdf';
   //const pdfUrl = 'https://rajeduboard.rajasthan.gov.in/downloads/LIFE-CERTIFICATE-PENSIONERS.pdf';
   const filename = 'example.pdf';
    this.pdfDownloadService.downloadPdf(pdfUrl, filename);
  }


  uploadFile(event: any) {
    console.log(event)
    let time1 = new Date();
    this.file = event.target.files[0];
    let ex2:any[]=this.file.name.split("."); 
    //console.log("size",this.file.size/1024)
    if(ex2[1].includes('JPEG') || ex2[1].includes('jpeg') || ex2[1].includes('JPG') || ex2[1].includes('jpg')  || ex2[1].includes('PNG') || ex2[1].includes('png') )
    {
      
    } else
    {
      alert("Only JPEG/PNG/JPG file format allowed")
      return;
    } 

    if((this.file.size/1024)>2048)
    {
      alert("Max 2 MB file size allowed")
      return;
    }
    this.fileName = "doc" + time1.getHours() + time1.getMilliseconds().toString()+"."+ex2[1];
    this.fileName = this.fileName.replace(" ", "")   
    const docTypeId = "61"
    const reader = new FileReader();
    var data4: any;


    reader.onloadend = () => {

      data4 = reader.result;  
      let data5 = data4.toString();
      this.imageUrl=data5;
      let str:any
      if(ex2[1].includes('JPEG') || ex2[1].includes('jpeg') || ex2[1].includes('JPG') || ex2[1].includes('jpg')  )
      {
        
        str="data:image/jpeg;base64,"
        
      }else if( ex2[1].includes('PNG') || ex2[1].includes('png'))
      {
        str="data:image/"+ex2[1]+";base64,"
      }else
      {
        str="data:application/"+ex2[1]+";base64,"
      }
   
      data5 = data5.replace(str, "")
     console.log("base 64 code ???",data5)
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docAttributes": [
        ],
        "data": [
          {
            "docTypeId": docTypeId,
            "docTypeName": "jpeg",
            "docName": this.fileName,
            "docTitle": "Life Certificate",
            "content": data5
          }
        ]
      }
    
      console.log(this.imageUrl)
      this.loader.show()
      this.apiService.postIntegration("wcc/uploaddocs", data).subscribe((res: any) => {
       
        this.uploadedDataRes=res;
        this.loader.hide() 
        console.log("Upload on server Data",res)
        console.log(res.data.document[0].docId)
        //alert(res.data.document[0].docId) 
        //this.loader.show()
        if (res.data.document[0].docId)
         {       
          this.dmsDocId=res.data.document[0].docId;
         }
      },(error: any)=>{
        this.loader.hide()
      })

      this.isvisible=true
    };
    reader.readAsDataURL(this.file);
  
  }
 
VerifaifSubmitByOtp(){
  this.verifyMobileNo();  
   return false;  
}


verifyMobileNo(): void {
  console.log( this.ppoInfo.mobileNumber)
  if(this.ppoInfo.mobileNumber)
  {
  let data={
    "ssoId":"RJ121212",
    "sourceId":"1",
    "processId":"18",
    "mobileNo": this.ppoInfo.mobileNumber,
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
    alert("The Employee mobile number was not found");
  }
}

verifyOtp(res:any){
  const confirmDialog = this.dialog.open(CommonDialogueBoxComponent, {
    autoFocus: false,
    width: '350px',
    data: {
      action: '',
      id: 'otp',
      otpData:res,
      mobileNo: this.ppoInfo.mobileNumber
    },
  });

  confirmDialog.afterClosed().subscribe(data => {
    console.log("data",data);
    
    if (data.verified === 'Y') {
      this.submitLifeCert();
    }else{
      alert("The OTP (One-Time Password) was not verified")
    }
  })
}

  submitLifeCert(){

  
    let uploadData={
    "empCode":this.ppoInfo.employeeCode,
    "psnId": parseInt(this.ppoInfo.pensionerId),
     "docitem": [
     {
       "docTypeId": 281,
       "createUid": this.ppoInfo.pensionerId,
       "createAid":this.ppoInfo.pensionerId,
         "dmsdocid":this.dmsDocId,
         }
     ]
   }
   alert (this.dmsDocId);
   //console.log(this.ppoInfo.pensionerId)
   this.apiService.post('updatephotoid',uploadData).subscribe((res: any) => {  
    //alert(res.data.msg)
  
    if(res.status ='SUCCESS' && res.data.status=="Success"){

   

      if((res.data.msg=='Data Save Successfully')==true)
      {
        console.log("after uploade document id",res)
        let data1 =res;
       // alert(res.data.msg)
        // this.dialog.open(CommonDialogueBoxComponent,          
        //   {data: {
        //     res: data1,
        //     Actiontype:"Success",
        //     getEventStatus: (event: any)=>{console.log(event)
        //        this.buttonEvent = event;              
        //     }
        //   },disableClose: false,            
        // });
        this.isvisible=false;           
      }  
     }
    });  
  }
  //  openDialog(){   
  //  }


   picData:any='';
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
       this.isvisible=false;
     })
   }


  }