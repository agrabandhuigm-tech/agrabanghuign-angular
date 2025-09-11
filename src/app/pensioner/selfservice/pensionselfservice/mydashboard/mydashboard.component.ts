import { Component, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { log } from 'console';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { CommonModule } from '@angular/common';
import { PdfpreviewComponent } from 'src/app/pensioner/pdfpreview/pdfpreview.component';
import { TokenManagementService } from 'src/app/services/token-management.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.scss']
})

export class MydashboardComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() categoryId: string = '';
  isLifeCer: boolean = false;
  pensionerInfoResult: any[]=[];
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
  isHidden:boolean=false;
  dor:any;
  nIncrement:boolean=false;
  userdetails: any = {};
  
  constructor(private dashboardService: DashboardService,
    public apiService: ApiService,
    public api: ApiService,
    public apiurl: ApiUrlService,
    private actRoute: ActivatedRoute,
    public dialog: MatDialog,
    public authService: AuthService,
    public commonService: CommonService, private router: Router,private DatePipe: DatePipe,
    private tokenInfo:TokenManagementService) {
    this.flag = 0;

    // let details = localStorage.getItem('profileDetails');
    // let decDetails = this.config.decrypt(details);
    // this.userdetails =  JSON.parse(decDetails);
    // this.dor=this.userDetails[0][0].dateOfRetirement;
    // alert(this.dor)
    // let a = JSON.stringify(this.userdetails[0]);
    // this.dor= this.userdetails[0].dateOfRetirement ;
    // console.log("kk"+this.userdetails[0])
  }
  empinfo: any = {};
  ngOnInit(): void {
    this.api.configMenu = { isload: true, dash: true }
   
    this.empinfo = this.tokenInfo.empinfoJWTService;
    console.log("empinfo",this.empinfo)
    this.getPssStatus();
   
  }
 month:any;
 year:any;
  message: any;
  isStatus: boolean = false;
  requestId: any;
  isNotional:boolean=false;
  getPensionDtls() {
    //alert(this.empIdUserDtls)
    if (this.requestId) {
      this.isStatus = false
      let payload = {

        "empCode": '', "reqId": this.requestId, "pensionerId": 0
      }
      this.apiService.postpension('fetchpensionerdtls', payload).subscribe((res: any) => {
        console.log("New service", res);
        this.isStatus = true

        if (res.data[0].flag == 0) {
          this.message = "Your Request is pending at HO_Approver: " + res.data[0].hoApprover
        }

        else if (res.data[0].flag == 1) {
          this.message = "Your Request is forward by HO_Approver: " + res.data[0].hoApprover + "and pending at Zonal_Approver: " + res.data[0].zonalApprover;
        } else if (res.data[0].flag == 3) {
          this.message = "Your Request is Approved by Zonal_Approver: " + res.data[0].zonalApprover
        }
        else if (res.data[0].flag == 4) {
          this.message = "Your Request is Revert to HO_Approver:" + res.data[0].hoApprover + " by Zonal_Approver:" + res.data[0].zonalApprover;
        }
        else if (res.data[0].flag == 2) {
          //alert("Rejected")
          this.message = "Your  Request is Rejected by HO_Approver: " + res.data[0].hoApprover;
        }
        else if (res.data[0].flag == -1) {
          this.message = "Your Request is Not_Initiated."
        }

        else {
          this.message = ""
        }

      })
    } else {
      alert("First Enter request Id.")
    }

  }
  getPssStatus()
  {
    let data={
      "employeeCode": "",
      "ssoId": this.empinfo?.ssoId
  }
    this.apiService.postpension('getpssstatus', data).subscribe((res: any) => {
      console.log("New service", res);
      let data=JSON.parse(res.data)
      let psstoken = this.config.jWtencrypt({ssoId: this.empinfo?.ssoId, pensionerId: data.pensionerId,
        employeeId: data?.employeeId,employeeCode: this.empinfo?.employeeId, ppoNo: data.ppoNo
      });
      sessionStorage.setItem('pss', psstoken);
      
      let token = sessionStorage.getItem('pss') || "";
      if (token) {
        localStorage.setItem('ssoid', token);
        this.getSsoId = this.config.getDecodedAccessToken(token);
        this.commonService.getSsoIdToken = this.getSsoId.ssoId;
        this.getProfileDetails();
      }
      else {
        alert("Something went wrong , Please login again")
      }
    })
  }
  redirecttopensioEss() {
    console.log("aa", this.pensionerInfoResult[0].employeeId)
    let data = {
      "employeeId": this.pensionerInfoResult[ this.pensionerInfoResult.length-1].employeeId,
      "inType": 14
    }
    console.log("data", data)
    this.api.postNewEmployee("getPensionRevertEmpDetails", data).subscribe((res: any) => {
      if (res.data) {
        if (res.data.ISREVISIONUNDERPROCESS == "Y" || res.data.ISREVISIONUNDERPROCESS == "N" || res.data.ISREVISIONUNDERPROCESS == "M") {
          sessionStorage.setItem('landtoken', '');
          this.config.storeDetails("isess", "")
          this.router.navigate(['pension-ess']);


        } else if (res.data.ISREVISIONUNDERPROCESS == "Z") {
          this.dialog.open(CommonDialogueBoxComponent,
            {
              data: {
                Actiontype: 'pensioness',
                getEventStatus: (event: any) => {
                  console.log(event)
                }
              },
            });

        }
      }
    }, (error) => {
      alert("Error in revisionflag service");
    })

  }

  getProfileDetails() {
    //  this.ssodata= localStorage.getItem('ssoid');
    //   let ssoInfo =  this.config.getDecodedAccessToken(this.ssodata);
    var url = this.apiurl.url.getprofiledetails;
    var data = {
      "ssoId": this.getSsoId.ssoId,
    };
    this.api.postpension(url, data).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        let data:any=res.data;
      
       let data2:any[]=[
        data[data.length-1]
       ];
      
        this.pensionerInfoResult=data2;
        console.log("my dashboard", this.pensionerInfoResult)
        this.config.storeUserDetails(this.pensionerInfoResult)
        let encData: any = this.config.encrypt(JSON.stringify(this.pensionerInfoResult));
        localStorage.setItem('profileDetails', encData);
        this.commonService.personalProfileDetails.next(encData)
        // this.getPensionKitDetails(this.pensionerInfoResult[0].pensionerId);
        // this. getProfileDetails12()

        this.pssDetails = this.pensionerInfoResult[0]
        console.log("my dashboard",this.pssDetails);
        this.getPaymentDetails();
        this.getBillReferenceStatus();
        this.showCommutation();
        this.statusLifeCerificate()
        // this.checkLifeCertificate();
        this.dashboardService.pensionerid = this.pensionerInfoResult[0].pensionerId
        this.dor=this.pensionerInfoResult[0].DateOfRetirement
        this.notationIncrement(this.dor);
        if(this.dor.includes('JUN') ||this.dor.includes('JUNE')||this.dor.includes('Jun')||this.dor.includes('June'))
          {
            this.isNotional=true
          }
        // const dobParts = this.dor.trim().split('-'); // Assuming date is separated by slashes
        // const day = parseInt(dobParts[0], 10);
        // const month = parseInt(dobParts[1], 10);
        // const year = parseInt(dobParts[2], 10);
    
        this.actRoute.queryParams.subscribe(params => {

          let id:any = params['id'];
          if(id=='adv')
            {
              this.router.navigate(['advance-pension'])
            }
        });
          
      }
    })

  }
  day:any
  notationIncrement(dateOfRetirement:any){
    // this.getProfileDetails();
    var dor_n= new Date( this.dor)
    this.day=dor_n.getDay()
    this.month=dor_n.getMonth()
    this.year=dor_n.getFullYear()
    if((this.day==30)&&(this.month==6)&&(this.year<=2023)){
      this.nIncrement=true;
    }
  }
 
  getBillReferenceStatus() {
    var url = this.apiurl.url.getpensionerbillstatus;
    var data = {
      "pensionerId": this.pssDetails.pensionerId
    };
    this.api.postpension(url, data).subscribe((res: any) => {
      console.log("result>>>", res);
      //this.payCalDetails = res.data[0];
      if(res.data[0]=='1')
      {
        this.isHidden = false;
      }
      else{
        this.isHidden = true;
      }
      //console.log(this.payCalDetails)
    })
  }


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

  getDocId() {

    let data = {
      "pensionerId": this.pensionerInfoResult[0].pensionerId,
      "inType": 1,

    }

    this.apiService.pension(data, 'getLifeCertificateDocId').subscribe((res: any) => {
      console.log("res", res)
      if (res.status == 'SUCCESS') {
        if (res.data != null) {
          if (res.data) {
            this.commonService.Previewbydocid(res.data?.life_doc_id, 'MyDashboard');
          }else
          {
            alert("Certificate not avaiable.")
          }

        }else
        {
          alert("Certificate not avaiable.")
        }
      }

    })
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
  ngAfterViewInit(): void { }
  checkLifeCertificate() {
    let data =
    {
      "ppoNo": this.pssDetails?.ppoNo,
      "accountNo": this.pssDetails?.accNo.substr(this.pssDetails?.accNo.length - 4)
    }
    console.log("Check life cer", data)
    this.apiService.pension(data, "checkPssLifeCertificate").subscribe((res: any) => {
      console.log("life cer", res)
      if (res.data) {
        if (res.data?.status == "YES") {
          this.isLifeCer = false;
        } else {
          this.isLifeCer = true;
        }
      }
    })
  }
  isLoading3: boolean = false
  file: any;
  lifeCerDoc: any;
  uploadPdf(event: any) {
    let time1 = new Date();

    this.file = event.target.files[0];
    let ex2: any[] = this.file.name.split(".");
    console.log("size", this.file.size / 1024)
    if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

    } else {
      alert("Only PDF file format allowed")
      return;
    }

    if ((this.file.size / 1024) > 2048) {
      alert("Max 2 MB file size allowed")
      return;
    }

    let fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + "." + ex2[1];

    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("filename", fileName);
    this.isLoading3 = true;
    this.apiService.postOr("wcc/uploadfile", formData).subscribe((res: any) => {

      this.isLoading3 = false;
      if (res?.data?.document[0]?.docId) {

        this.lifeCerDoc = res.data.document[0].docId
        console.log("this.lifeCerDoc", this.lifeCerDoc)
        alert("Document Uploaded Successfully.")
      } else {
        alert("Some Error Occured")
      }

    }, (error) => {
      this.isLoading3 = false;
      alert("Some Error Occured")
    })
  }
  removeLifeDocId() {
    this.lifeCerDoc = null;
  }
  previewDocId(i:any) {
    if(i==1)
    {
      console.log("this.lifeCerDoc", this.lifeCerDoc)
      this.commonService.Previewbydocid(this.lifeCerDoc, 'MyDashboard')
    }else if(i==2)
    {
      console.log("docc", this.lifeStatusData?.uploadDocId)
      this.commonService.Previewbydocid(this.lifeStatusData?.uploadDocId, 'MyDashboard')
    }
    
  }
  submitLifeCertificate() {
    if(confirm("Are you sure...."))
    {
      let data = {      
        'inType':1,
        "pensionerId": Number(this.pssDetails?.pensionerId),
        "ppoNo": Number(this.pssDetails?.ppoNo),
        "docTypeId": 61,
        "name": this.pssDetails?.employeeName,
        "address": this.pssDetails?.currentAddress,
        "accountNo": this.pssDetails?.accNo.substr(this.pssDetails?.accNo.length - 4),
        "gender": this.pssDetails?.gender,
        "martialStatus": this.pssDetails?.maritalStatus,
        "nameTitle": "N/A",
        "uploadDocId": this.lifeCerDoc,
        "mob":Number(this.pssDetails?.mobileNumber)
        
    }
    console.log("request life certificate", data);
    this.apiService.pension(data,"requestLifeCertificate").subscribe((res:any)=>
    {
      console.log("res",res);
      if(res.data)
      {
       this.statusLifeCerificate();
       this.checkLifeCertificate();
        alert(res.data);
      }
    })
    }
   
  }
  isLifeCerUpload:boolean=false;
  lifeStatusData:any;
  lifeStatus:any;
  isLifeRevert:boolean=false;
  statusLifeCerificate() {
    let data = {      
        'inType':5,
        "pensionerId": Number(this.pssDetails?.pensionerId),
       
        
    }
    console.log("status life certificate", data);
    this.apiService.pension(data,"requestLifeCertificate").subscribe((res:any)=>
    {
      console.log("res",res);
      this.lifeStatusData=res;
      if(res.data==" ")
      {
       
      }else{
        this.lifeStatusData=JSON.parse(res.data)
       
        console.log("this.lifeStatusData1",this.lifeStatusData);
       
        if(this.lifeStatusData?.status==1)
        {
          this.isLifeCerUpload=true
        }
        if(this.lifeStatusData?.uploadDocId==0)
        {
          this.isLifeCerUpload=false
        }
        if(this.lifeStatusData?.ArpFlag==0)
        {
          this.lifeStatus="Pending"
        }else if(this.lifeStatusData?.ArpFlag==1)
        {
          this.lifeStatus="Approved"
        }else if(this.lifeStatusData?.ArpFlag==2)
        {
          this.lifeStatus="Revert";
          this.isLifeRevert=true
        }
      }
    })
  
   
  
  }
  submitRevertLifeCertificate()
  {
    if(confirm("Are you sure...."))
    {
      let data = {      
        'inType':7,
        "arvFlag":0,
       "lifeCertId":this.lifeStatusData?.lifeCertId,
        "uploadDocId":this.lifeCerDoc
    }
    console.log("revert life certificate", data);
    this.apiService.pension(data,"requestLifeCertificate").subscribe((res:any)=>
    {
      console.log("res",res);
      if(res.data)
      {
       this.statusLifeCerificate();
      //  this.checkLifeCertificate();
        alert(res.data);
      }
    })
    }
  }
  redirectToMultipal(i:any)
  {
    if(i==1)
    {
      this.router.navigate(['ChangeMonthlyTreasury'])
    }
    else if(i==2)
    {
      this.router.navigate(['BankDetails'])
    }
    else if(i==3)
    {
      this.router.navigate(['AddressDetails'])
    }
    else if(i==6)
      {
        this.redirectToEarnAdvancedPension()
       
      }else if(i==7)
        {
          console.log("dor",this.dor)
          if(this.dor.includes('JUN') ||this.dor.includes('JUNE')||this.dor.includes('Jun')||this.dor.includes('June'))
          {
            this.router.navigate(['notional-increment'])
          }else
          {
            alert("You are not eligible.")
          }
         
        }
    //else if(i==4)
    // {
    //   this.router.navigate(['ChangeProfileDetails'])
    // }
    // else if (i==5)
    // {
    //   this.router.navigate(['FamilyDetailUpdate'])
    // }
    // else
    // {
    //   this.dialog.open(CommonDialogueBoxComponent,
    //     {
    //       data: {
    //         Actiontype: "ComingSoon",
    //         getEventStatus: (event: any) => {
    //           console.log(event)
    //         }
    //       },
    //     });
    // }
    // this.dialog.open(CommonDialogueBoxComponent,
    //   {
    //     data: {
    //       Actiontype: "ComingSoon",
    //       getEventStatus: (event: any) => {
    //         console.log(event)
    //       }
    //     },
    //   });
  }
  task:any
  redirectToEarnAdvancedPension()
  {
   
    let sendData=this.pensionerInfoResult[0]?.ppoNo+'-'+this.pensionerInfoResult[0]?.accNo.slice(-4)
    this.apiService
    .pension({
       ppoId: sendData
    },'getConsentStatus' )
    .subscribe({
      next: (res:any) => {
        console.log("res",res)
        if(JSON.stringify(res).includes('consentDtl')){

          this.task = res;
          console.log(this.task);
          sessionStorage.setItem(
            'empConsentDetails',
            JSON.stringify(this.task)
          );
          console.log("this.task",this.task.consentDtl)
         
            if (this.task.consentDtl) {
              if (this.task.consentDtl.ifmsStatus === 'Success') {
                this.router.navigate([
                  '/advance-pension/earned-advance-salary',
                ]);
              } else {
                this.router.navigate(['/advance-pension']);
              }
            } else {
              this.router.navigate(['/advance-pension']);
              //this.router.navigate(['/ess/earned-advance-withdraw']);
            }

        }else{
          this.router.navigate(['/advance-pension']);
        }
      
     
 

        // console.log('this.consentSource', this.consentSource);
        //"IFMS";
      },
      error: (err)=> {

        
      },
    });

  }
  lastSalaryDetails:any;
  getLastSalaryDetails() {
    let sendData=this.pensionerInfoResult[0]?.ppoNo+'-'+this.pensionerInfoResult[0]?.accNo.slice(-4)
    this.apiService
      .pension( {
        ppoId: sendData
      
      },'getCurrentAvailablePension')
      .subscribe({
        next: (res:any) => {
     
         
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
            source: null
          };

          localStorage.setItem(
            'consentDetails',
            JSON.stringify(consentDetails)
          );
        },
      });
  }
}





