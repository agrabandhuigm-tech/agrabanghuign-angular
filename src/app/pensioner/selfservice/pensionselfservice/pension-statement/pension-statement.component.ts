import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-pension-statement',
  templateUrl: './pension-statement.component.html',
  styleUrls: ['./pension-statement.component.scss']
})
export class PensionStatementComponent implements OnInit {


  showPensionerIdCardButton: boolean = false;
  DateOfRetirement: string; // 
  

  // @ViewChild('drawer') public drawer!: MatDrawer;
 public getScreenWidth: any;
 panelOpenState :boolean=false;
 showFiller = false;
 event: any;
 currentRoute:any;
 rotater: any = document.getElementsByClassName('toggler-button');
 sidebarElement:any=document.getElementsByClassName('sidebar');
 getSmSidebar: any;

 myElement:any;
 profileDetails:any ;
 url:any;
 currentUrl:any;
 myDashboardShow:boolean=false;
 config: AppConfig = new AppConfig();
 getSsoId:any;
 ssoInfo:any;
 isLoad:boolean=true
 pensionID:any;
 isHidden:boolean=false;


  monthYearList: any[]=[];
  yearList: any[] = [];
  monthList:any[] = [];
  reportYear: any = '';
  psnYear:any;


//   getSsoId:any;
// profileDetails : any;
// config : AppConfig = new AppConfig();
base64data: any;
pdfVisible:boolean = false;

currentMonth:any;
currentYear:any;



  constructor(private apiEssService: ApiEssService,public _Service:ApiService,private load:LoaderService,private sanitizer: DomSanitizer,
    private router:Router,public apiService: ApiService,public api:ApiService,public apiurl: ApiUrlService,public dialog:MatDialog,
    private dashboardService:DashboardService, private activatedRoute: ActivatedRoute,
    public commonService:CommonService
  ) {

   }

  ngOnInit(): void {


    this.getProfileDetails();
    this.api.configMenu.subscribe((item: any) => {
      this.myDashboardShow = item.dash;
     this.isLoad=item.isload;
  
  
     
  
    //  this.getProfileDetails();
  })
    let ssodata: any = localStorage.getItem('ssoid');
    this.ssoInfo =  this.config.getDecodedAccessToken(ssodata);
    console.log(this.ssoInfo)  ;
  
      this.dashboardService.getDashboardNav().subscribe((res:any)=>{
            if(res){
            this.myDashboardShow = true;
            }
      });
  
  
    this.pageRefresh();
    this.dashboardService.setLoggedIn(true);
    this.dashboardService.getLoggedIn().subscribe(value => {
      this.myDashboardShow = value;
      
  });
  
  
  
    this.apiService.configMenu.subscribe((item: any) => {    
        this.url = item.url;
        console.log( this.url)
    })
  
   // this.apiService.configMenu = { url: "Check Application Status" };
    
    //this.getUserInfo(); 
    this.getScreenWidth = window.innerWidth;
    this.router.events.subscribe((evt=>{
      if (evt instanceof NavigationEnd) {
        this.currentRoute = evt.url;
      }
  
    }));
  
    if(localStorage.getItem("profileDetails")){
      let details =localStorage.getItem("profileDetails");
          let decDetails = this.config.decrypt(details);
          this.getSsoId =  JSON.parse(decDetails);
          this.profileDetails= this.getSsoId[0];    
          console.log('profileDetails>>>>>>>>>>>>>>>>>>>>>>',this.profileDetails)
           this.commonService.personalProfileDetails.next(details)      
      
     }
    
    ///////////////////////////////////////////////////////

    // if(localStorage.getItem("profileDetails")){
    //   let details =localStorage.getItem("profileDetails");
    //       let decDetails = this.config.decrypt(details);
    //       this.getSsoId =  JSON.parse(decDetails);
    //       this.profileDetails= this.getSsoId[0];    
    //       console.log('profileDetails>>>>>>>>>>>>>>>>>>>>>>',this.profileDetails)
    //       //  this.commonService.personalProfileDetails.next(details)        
    //  }


    this.getMonthYear();

  }


  getProfileDetails(){
    // console.log(this.ssoInfo.ssoid)
     // var url = this.apiurl.url.getprofiledetails;
    
    this.profileDetails='';
     this.commonService.personalProfileDetails.subscribe((res:any)=>{
        if(res){
          let details = res
          console.log(details)
          let decDetails = this.config.decrypt(details);
        
          this.getSsoId =  JSON.parse(decDetails);
         
          console.log("profile details without service", this.getSsoId)
          this.api.getPensionerDtls=this.getSsoId;
          // alert("side bar")
          this.profileDetails= this.getSsoId[0];
          this.pensionID = this.profileDetails.pensionerId;
          // this.getBillReferenceStatus();
          console.log("profile details without service1>>>>", this.profileDetails)
          this.DateOfRetirement = this.profileDetails.DateOfRetirement; 
          // this.checkRetirementDate();
          // alert("side bar")
        }
     })
    }

    pageRefresh(){
      this.activatedRoute.url.subscribe((res:any)=>{
        console.log('this.activatedRoute', res);
      });
       
     }

  getMonthYear(){
    this.apiEssService.empServicese('getYearMonth',{}).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.status == 'SUCCESS' && res?.data && res?.data.length > 0){
            this.monthYearList = res.data;
            console.log('monthYearList>>>>>>>>>>>>>>>>>>>',this.monthYearList)

            ////////////////////////////////////////////////////////////////////

            // this.yearList = this.monthYearList.reduce((accm: any , current: any)=>{
            //     const exists = accm.find((item: any) => item.psnYear == current.psnYear);
            //     if(!exists){
            //       let data = {
            //         psnYear: current.psnYear
            //       };
            //       accm.push(data)
            //     }
            //     return accm;
            //   }, [])

          // console.log(this.reportYear);

          /////////////////////////////////////////////////////////////

           // Extract unique years
    this.yearList = this.monthYearList.reduce((accm: any[], current: any) => {
      const exists = accm.find(item => item.psnYear === current.psnYear);
      if (!exists) {
        accm.push({ psnYear: current.psnYear });
      }
      return accm;
    }, []);

    // Sort yearList by year
    this.yearList.sort((a: any, b: any) => parseInt(a.psnYear, 10) - parseInt(b.psnYear, 10));

    // Get the current year and previous year
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Filter to include only the current year and previous year
    this.yearList = this.yearList.filter(item => parseInt(item.psnYear, 10) === currentYear || parseInt(item.psnYear, 10) === previousYear);

    console.log('yearList>>>>>>>>>>>>>>>>>>>',this.yearList);

        //  this.yearList.sort((a:any, b:any) => a.psnYear - b.psnYear);
        //   console.log(this.yearList)
        }
      },
      error:(err:any)=>{

      },
      complete: ()=>{
        
      }
    })

  }

  getMonthFromYear(){
    // this.monthList = this.monthYearList.filter((item:any) => item.psnYear == this.reportYear);
    // console.log('monthList>>>>>>>>>>>>>>>>>>>>>>>>',this.monthList)
    // this.monthList.sort((a:any, b:any) => a.psnMonthNumber - b.psnMonthNumber);

    ///////////////////////////

    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;
    let previousMonthNumber = now.getMonth(); // getMonth() returns 0 for January, 1 for February, etc.
    
    // Handle previous month format
    // let formattedPreviousMonthNumber = (previousMonthNumber + 1).toString().padStart(2, '0');
    let formattedPreviousMonthNumber = (previousMonthNumber ).toString().padStart(2, '0');
  
    // Determine the range of months based on the year
    if (this.reportYear === currentYear.toString()) {
      // Current year: January to previous month
      this.monthList = this.monthYearList.filter((item: any) => 
        // item.psnYear === this.reportYear && parseInt(item.psnMonthNumber, 10) <= previousMonthNumber + 1
        item.psnYear === this.reportYear && parseInt(item.psnMonthNumber, 10) <= previousMonthNumber
      );
    } else if (this.reportYear === previousYear.toString()) {
      // Previous year: June to December
      this.monthList = this.monthYearList.filter((item: any) => 
        item.psnYear === this.reportYear && parseInt(item.psnMonthNumber, 10) >= 6
      );
    } else {
      // If the reportYear is not the current or previous year, clear the monthList
      this.monthList = [];
    }
  
    // Sort monthList by month number
    this.monthList.sort((a: any, b: any) => parseInt(a.psnMonthNumber, 10) - parseInt(b.psnMonthNumber, 10));
  
    console.log('monthList>>>>>>>>>>>>>>>>>>>>>>>>', this.monthList);
  }



  submit(){

    // let date: Date = new Date();  
    // console.log("Date = " + date);

    // this.currentMonth = date.getMonth();
    // console.log(this.currentMonth)
    // this.currentYear = date.getFullYear();
    // console.log(this.currentYear)

    let data ={

      "reportPath": "/Pension/Pension_Slip/Report/Pension_Payment_Slip.xdo",
      "format": "pdf",
      "params": [
        {
         "name": "in_type",
         "value": '2'
       },
      //  {
      //    "name": "bill_month",
      //    "value": this.monthselected
      //  },
       {
         "name": "bill_year",
         "value": this.reportYear,
       },
       {
        "name": "accno",
        "value": this.profileDetails.accNo.slice(-4),
      },
       {
         "name": "ppono",
         "value":  (this.profileDetails?.ppoNo.toString()).length === 10 ? parseInt(this.profileDetails?.ppoNo.toString().slice(3)) : this.profileDetails?.ppoNo
       },
      
      ]
    }


    this._Service.postOr("report/singlereport", data).subscribe((res: any) => {
      console.log("res", res.data.report.content);
      this.load.hide();

      // debugger;
      const byteArray = new Uint8Array(
        atob(res.data.report.content)
          .split("")
          .map(char => char.charCodeAt(0))
      );
      // this.pdfSrc = "";
      const file = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      console.log(fileURL)
      // this.pdfSrc = fileURL;


      const pdfWindow = window.open("");
      pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");

      // //////////////////////////////////////////
      //   this.pdfVisible = true ;
      // if (top?.document.getElementById('ifrm')) {

      //   top.document.getElementById('ifrm')?.setAttribute("src", fileURL);

      // }else {
      //   alert("Some error occured");
      // }


      this.load.hide();

      ///////////////////////////////////////////////////////


    }, (error) => {
      this.load.hide();
      alert("Some error occured");
    })


  }
  preview(base:any) {
    // this.isVisible = true;
    // console.log("base64Pdf", base);
    // this.base64Pdf=this.data.message.base64Pdf;
    // let base=this.data.message.base64Pdf;

    this.base64data = "data:application/pdf;base64," + base;
    // console.log("base64", this.base64data);
    this.base64data = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(base) as any).changingThisBreaksApplicationSecurity;
    if (top?.document.getElementById('ifrm')) {

      // const pdfWindow = window.open("");
      // pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + this.base64data + "'></iframe>");

      //  nayi window mai open karenge pdf ko . 


      top.document.getElementById('ifrm')?.setAttribute("src", this.base64data);

      // same html component mai open karengi . 

    }

  }


}
