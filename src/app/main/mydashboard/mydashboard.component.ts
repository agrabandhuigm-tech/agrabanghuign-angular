import { Component, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { log } from 'console';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { PdfpreviewComponent } from '../pdfpreview/pdfpreview.component';
import { CommonDialogueBoxComponent } from '../common-dialogue-box/common-dialogue-box.component';



@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.scss']
})

export class MydashboardComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() categoryId: string = '';

  pensionerInfoResult: any;
  profileDetails: any;
  payCalDetails: any;
  userDetails: any = {};
  config: AppConfig = new AppConfig();
  isVisible: boolean = false;
  pssDetails: any;
  getSsoId: any;
  num: any = 0;
  param: any;
  ssodata: any;
  imageUrl: any = "";
  details: any
  getPsnPpoCpo: any;
  imageBase64Data: any;
  flag: number;
  resData: any;



  constructor(private dashboardService: DashboardService,
    public apiService: ApiService,
    public api: ApiService,
    public apiurl: ApiUrlService,
    private actRoute: ActivatedRoute,
    public dialog: MatDialog,
    public authService: AuthService,
    public commonService: CommonService, private router: Router) {

    this.flag = 0;


  }

  ngOnInit(): void {

    this.api.configMenu = { isload: true, dash: true }
    // this.actRoute.queryParams.subscribe((params: any)=>{
    //   debugger
    //   //localStorage.removeItem('ssoid');
    //   if(params && params['id']){
    //     this.param=params['id'];   
    //     localStorage.setItem('ssoid',params['id']);    
    //     debugger   
    //    this.getSsoId=this.config.getDecodedAccessToken(params['id']);
    //    debugger
    //    console.log("this.getSsoId",this.getSsoId)
    //    this.commonService.getSsoIdToken= this.getSsoId.ssoId;
    //     localStorage.setItem('ssoid',params['id']);

    //    console.log("SSO ID>>>>>",this.commonService.getSsoIdToken)  
    //   } 

    //   else{ }
    //  debugger
    //   let ssodata: any = localStorage.getItem('ssoid');
    //   this.getSsoId =  this.config.getDecodedAccessToken(ssodata);
    //   this.getProfileDetails();



    // })   


    let token = sessionStorage.getItem('pss') || ""
    if (token) {
      localStorage.setItem('ssoid', token);
      this.getSsoId = this.config.getDecodedAccessToken(token);
      this.commonService.getSsoIdToken = this.getSsoId.ssoId;
      this.getProfileDetails();
    } else {
      alert("Something went wrong , Please login again")

    }

  }
  message: any;
  isStatus: boolean = false;
  requestId: any;
  getPensionDtls() {
    //alert(this.empIdUserDtls)
    if (this.requestId) {
      this.isStatus = false
      let payload = {

        "empId": 0, "reqId": this.requestId, "pensionerId": 0
      }
      this.apiService.postpension('fetchpensionerdtls', payload).subscribe((res: any) => {
        console.log("New service", res);
        this.isStatus = true

        if (res.data[0].flag == 0) {
          this.message = "Your Request is in Process."
        }
        // else if(res.data[0].flag==1)
        // {
        //    this.message="Your Request is Approved by HO_Approver."
        // }
        else if (res.data[0].flag == 1) {
          this.message = "Your Request is forward by HO_Approver."
        } else if (res.data[0].flag == 3) {
          this.message = "Your Request is Approved by Zonal_Approver."
        }
        else if (res.data[0].flag == 4) {
          this.message = "Your Request is Revert to HO_Approver by Zonal_Approver."
        }
        else if (res.data[0].flag == 2) {
          //alert("Rejected")
          this.message = "Your  Request is Rejected by HO_Approver."
        }
        else if (res.data[0].flag == -1) {
          this.message = "Your Request is Not_Initiated."
        }
        else if (res.data[0].flag == 0) {
          this.message = "Your Request is pending at HO_Approver."
        }
        else {
          this.message = ""
        }

      })
    } else {
      alert("First Enter request Id.")
    }

  }
  getProfileDetails() {
    //  this.ssodata= localStorage.getItem('ssoid');
    //   let ssoInfo =  this.config.getDecodedAccessToken(this.ssodata);
    var url = this.apiurl.url.getprofiledetails;
    var data = {
      //  "ssoId": this.ssoInfo
      // "ssoId": this.ssoInfo.ssoId
      "ssoId": this.getSsoId.ssoId,
    };
    this.api.postpension(url, data).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        this.pensionerInfoResult = res.data;
        console.log("Header Pensioner data ", this.pensionerInfoResult)
        this.config.storeUserDetails(this.pensionerInfoResult)
        let encData: any = this.config.encrypt(JSON.stringify(res.data));
        localStorage.setItem('profileDetails', encData);
        this.commonService.personalProfileDetails.next(encData)
        // this.getPensionKitDetails(this.pensionerInfoResult[0].pensionerId);
        // this. getProfileDetails12()
        this.pssDetails = res.data[0]
        this.getPaymentDetails();
        this.showCommutation();
        this.dashboardService.pensionerid = res.data[0].pensionerId
      }
    })

  }


  // getProfileDetails12()
  // { 
  //   this.commonService.personalProfileDetails.subscribe((res)=>{
  //     this.details = res
  //     console.log(this.details)
  //    if( this.details ){
  //       let decDetails = this.config.decrypt(this.details);
  //       this.getSsoId =  JSON.parse(decDetails);
  //       this.pssDetails=  this.getSsoId[0];
  //       console.log("Pss Info On My dashboard", this.pssDetails)
  //       console.log(this.getSsoId.length)
  //      if(this.getSsoId.length > 0){    
  //       this.getPaymentDetails();
  //      }
  //     }      
  //   })

  // //this.dashboardService.setDashboardNav(true);
  // this.dashboardService.setLoggedIn(true);
  //  }


  ngOnChanges(changes: SimpleChanges) {
    this.categoryId = this.param;
    console.log(changes['categoryId'].currentValue)
  }
  valuechange(datavalue: any) {
  }

  updateUserDetails(item: any) {

    console.log('item data>>', item)
    console.log('pensioner id>>', item.pensionerId)
    let encData: any = this.config.encrypt(JSON.stringify(item));
    localStorage.setItem('userDetails', encData);
    let details = localStorage.getItem('userDetails');
    let decDetails = this.config.decrypt(details);
    this.userDetails = JSON.parse(decDetails);
  }
  isShowComm: boolean = false
  showCommutation() {
    let payloadData = {
      "inMstType": 29,
      "inValue": 0,
      "inValue2": 0,
      "inValue3": this.pssDetails.employeeCode
    }
    this.apiService.post('allmstdata', payloadData).subscribe((res: any) => {
      this.resData = JSON.parse(res.data)
      console.log(this.resData)
      console.log(this.resData[0].vInIsAutoapprove)

      if (this.resData[0].vInIsAutoapprove == 1) {
        this.isShowComm = true
      }
    })
  }
  redirecttocommutation() {
    this.router.navigate(['/CommutationRequests']);
  }
  previewFiles() {
    alert("Response Data Is Blank that's why here don't get Doc ID .")
    console.log(this.pensionerInfoResult[0].pensionKitId)
    let dmsDocId = this.pensionerInfoResult[0].pensionKitId;
    if (dmsDocId = this.pensionerInfoResult[0].pensionKitId) {
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": this.pensionerInfoResult[0].pensionKitId
          }
        ]
      }
      console.log("single report data", data)
      this.api.postIntegration("wcc/getfiles", data).subscribe((res: any) => {
        console.log("res", res.data.document[0].content);
        if (res.data.document[0].content) {
          let data = {
            "base64Pdf": res.data.document[0].content, "redirectUrl": "pensioner/pssdashboard"
          }
          console.log("data", data);
          this.dialog.open(PdfpreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
        }
      })
    } else {
      alert("Preview Not Available")
    }
  }
  getPaymentDetails() {
    var url = this.apiurl.url.getppodetails;
    var data = {
      "ssoId": this.pssDetails.ssoId,
      "pensionerId": this.pssDetails.pensionerId,
      "ppoNo": this.pssDetails.ppoNo
    };
    this.api.postpension(url, data).subscribe((res: any) => {
      console.log("result>>>", res);
      this.payCalDetails = res.data[0];
      console.log(this.payCalDetails)
    })
  }
  downloadLifeCertificate() {
    console.log(this.pssDetails)
    let dmsDocId = this.pssDetails.lifeCertificateId;
    if (dmsDocId = this.pssDetails.lifeCertificateId) {
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": this.pssDetails.lifeCertificateId
          }
        ]
      }
      this.api.postIntegration("wcc/getfiles", data).subscribe((res: any) => {
        console.log("res", res.data.document[0].content);
        if (res.data.document[0].content) {
          let data = {
            "base64Pdf": res.data.document[0].content, "redirectUrl": "pensioner/pssdashboard"
          }
          console.log("data", data);
          this.downloadImage(res.data.document[0].content)

        }
      })
    } else {
      alert("Preview Not Available")
    }

  }
  downloadImage(base64: any) {
    const link = document.createElement('a');
    link.href = base64;
    link.download = 'image.jpeg'; // Replace 'image.png' with the desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  viewDetails(resData: any) {

    console.log("Image Show", resData)
    this.dialog.open(CommonDialogueBoxComponent,
      {
        data: {
          getEventStatus: (event: any,) => {
            console.log(event)
            // this.buttonEvent = event;                        
          },
          res: "", index: "",
          imageRes: resData,
          //index:i,
        },
      });
  }

  getPensionKitDetails(pensionerId: any) {
    var url = this.apiurl.url.getpensionkitdtls;
    var data = {
      "pensionerId": pensionerId,

    };
    this.api.postpension(url, data).subscribe((res: any) => {
      this.getPsnPpoCpo = res.data;
      console.log("Result of pension kit service>>>", res);
      console.log("Pensioner Id>>>For GPO PPO CPO", res)
      // this.payCalDetails=res.data[0];    
      //   console.log(this.payCalDetails)  
    })
  }

  viewCertificate() {

    const certificateId = this.pssDetails.lifeCertificateId; // Replace with the actual certificate ID or identifier
    //alert(this.pssDetails.lifeCertificateId)
    console.log("Life Certificate ID:", certificateId)
    let data = {

      "type": "pension",
      "sourceId": 2,
      "docs": [
        {
          "docId": this.pssDetails.lifeCertificateId
        }
      ]
    }
    console.log("single report data", data)
    this.apiService.postOr("wcc/getfiles", data).subscribe((res: any) => {
      if (res.data.document[0].content) {
        console.log(res.data.document[0].content)
        this.imageUrl = "data:image/jpeg;base64," + res.data.document[0].content;
        this.viewImage(this.imageUrl)
      }
      // this.isvisible=false;
    })

  }

  viewImage(resData: any) {
    //console.log("Image Show",resData)
    this.dialog.open(CommonDialogueBoxComponent,
      {
        data: {
          getEventStatus: (event: any,) => {
            console.log(event)
            // this.buttonEvent = event;                        
          },
          res: resData,
          index: "",
          Actiontype: "ViewImage",
        },
      });
  }

  // Coming Soon botten Data
  comingSoonData() {
    this.dialog.open(CommonDialogueBoxComponent,
      {
        data: {

          Actiontype: "ComingSoon",
          getEventStatus: (event: any) => {
            console.log(event)

          }
        },
      });

  }

  redirectUrl(path: any) {
    this.router.navigate(['/' + path]);
  }

  ngAfterViewInit(): void {

  }
}





