// import { Component, OnInit } from '@angular/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatDrawer, } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { log } from 'console';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
import { MatDialog } from '@angular/material/dialog';

import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonService } from 'src/app/services/common.service';
import { PdfpreviewComponent } from 'src/app/main/pdfpreview/pdfpreview.component';





@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit {

  userDetails: any = {};
  constructor(private router: Router, public apiService: ApiService, public api: ApiService, public apiurl: ApiUrlService, public dialog: MatDialog, private dashboardService: DashboardService, private activatedRoute: ActivatedRoute,
    public commonService: CommonService) {
  }


  @ViewChild('drawer') public drawer!: MatDrawer;
  public getScreenWidth: any;
  panelOpenState: boolean = false;
  showFiller = false;
  event: any;
  currentRoute: any;
  rotater: any = document.getElementsByClassName('toggler-button');
  sidebarElement: any = document.getElementsByClassName('sidebar');
  getSmSidebar: any;

  myElement: any;
  profileDetails: any;
  url: any;
  currentUrl: any;
  myDashboardShow: boolean = false;
  config: AppConfig = new AppConfig();
  getSsoId: any;
  ssoInfo: any;
  isLoad: boolean = true
  ngOnInit(): void {
    this.getProfileDetails();
    this.api.configMenu.subscribe((item: any) => {
      this.myDashboardShow = item.dash;
      this.isLoad = item.isload;
      //  this.getProfileDetails();
    })
    let ssodata: any = localStorage.getItem('ssoid');
    this.ssoInfo = this.config.getDecodedAccessToken(ssodata);
    console.log(this.ssoInfo.ssoId)

    this.dashboardService.getDashboardNav().subscribe((res) => {
      if (res) {
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
      console.log(this.url)
    })

    // this.apiService.configMenu = { url: "Check Application Status" };

    //this.getUserInfo(); 
    this.getScreenWidth = window.innerWidth;
    this.router.events.subscribe((evt => {
      if (evt instanceof NavigationEnd) {
        this.currentRoute = evt.url;
      }

    }));

    if (localStorage.getItem("profileDetails")) {
      let details = localStorage.getItem("profileDetails");
      let decDetails = this.config.decrypt(details);
      this.getSsoId = JSON.parse(decDetails);
      this.profileDetails = this.getSsoId[0];
      this.commonService.personalProfileDetails.next(details)

    }

  }

  //  private setLoggedIn(value: boolean): void {

  // }

  redirectToInbox() {
    this.router.navigate(['inbox']);
  }
  pageRefresh() {
    this.activatedRoute.url.subscribe((res) => {
      console.log('this.activatedRoute', res);
    });

  }


  @HostListener('window:resize', ['$event'])
  isLargeScreen() {
    this.myElement = document.getElementById('side-bar');
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > 991) {
      this.showFiller = false;
      this.getSmSidebar == document.getElementsByClassName('sm-sidebar')
      // this.panelOpenState = true;
      return true;
    }
    else if (this.getScreenWidth < 992 && this.getScreenWidth > 768) {
      if (this.showFiller == true) {
        this.sidebarElement[0].classList.remove('sm-sidebar');
      }
      else {
        if (this.panelOpenState == false || this.showFiller == false) {
          this.sidebarElement[0].classList.add('sm-sidebar');
        }
      }
      return true;
    }
    else {
      this.sidebarElement[0].classList.remove('sm-sidebar');
      return false;
    }
  }
  toggle_sm(e: any) {
    this.sidebarElement[0].classList.toggle("sm-sidebar");
    this.showFiller = !this.showFiller
    this.panelOpenState = false;
  }

  toggle_menu(e: any) {

    if (Object.values(this.myElement.classList).includes('sm-sidebar')) {
      this.rotate();
    }
    this.panelOpenState = true
    this.sidebarElement[0].classList.remove('sm-sidebar');
    this.showFiller = true;
  }


  rotate() {
    this.rotater[0].classList.toggle("active")
  }

  hideSidenavAfterClick() {
    if (window.innerWidth < 768) {
      this.drawer.close();
    }
  }

  getProfileDetails() {

    // console.log(this.ssoInfo.ssoid)
    // var url = this.apiurl.url.getprofiledetails;
    // debugger
    this.profileDetails = '';
    this.commonService.personalProfileDetails.subscribe((res: any) => {
      if (res) {
        let details = res
        let decDetails = this.config.decrypt(details);

        this.getSsoId = JSON.parse(decDetails);

        console.log("profile details without service", this.getSsoId)
        // alert("side bar")
        this.profileDetails = this.getSsoId[0];
        console.log("profile details without service1>>>>", this.profileDetails)
        // alert("side bar")
      }
    })


  }

  previewFiles() {

    // alert("Response Data Is Blank that's why here don't get Doc ID .")
    // console.log(item);

    console.log(this.profileDetails.pensionKit)


    if (!this.profileDetails.pensionKit || this.profileDetails.pensionKit == 'N/A') {
      alert("Preview Not Available")
      return
    }
    let dmsDocId = this.profileDetails.pensionKit;
    if (dmsDocId = this.profileDetails.pensionKit) {
      let data = {
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": this.profileDetails.pensionKit
          }
        ]
      }
      console.log("single report data", data)
      this.api.postIntegration("wcc/getfiles", data).subscribe((res: any) => {
        console.log("res", res);
        if (res.data.document[0].content) {
          let data = {
            "base64Pdf": res.data.document[0].content,
            "redirectUrl": "pensioner/selfservice/pensionselfservice/MyDashboard"
            //"redirectUrl":"pensioner/pssdashboard"
          }
          console.log("data", data);
          this.dialog.open(PdfpreviewComponent, { width: '70%', data: { message: data }, disableClose: false });

        }
      })
    } else {
      alert("Preview Not Available")
    }
  }
  isShowComm: boolean = false
  showCommutation() {
    let payloadData = {
      "inMstType": 29,
      "inValue": 0,
      "inValue2": 0,
      "inValue3": this.profileDetails.employeeCode
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

  resData: any
  redirectUrl(path: any) {
    if (path == 'CommutationRequests') {
      this.router.navigate(['/' + path]);
    }

    // let purl: string = this.router['location']._platformLocation.location.origin;
    // if(purl.includes("https://ifms.rajasthan.gov.in" ))
    // {
    //   if(path=='CommutationRequests')
    //   {
    //     let payloadData= {
    //       "inMstType": 29,
    //       "inValue": 0,  
    //       "inValue2": 0,  
    //       "inValue3":this.profileDetails.employeeCode
    //     }
    //     this.apiService.post('allmstdata',payloadData).subscribe((res:any)=>{
    //       this.resData=JSON.parse(res.data)
    //       console.log( this.resData)
    //       console.log(this.resData[0].vInIsAutoapprove)

    //   if (this.resData[0].vInIsAutoapprove == 1) {
    //         // alert("Welcome To Commutation !!!")
    //          // Redirect to page1
    //       } else {
    //         alert("You are not applicable for commutation!!!")

    //       }
    //     })
    //   }
    // }else
    // {
    //   if(path=='CommutationRequests')
    //   {
    //     let payloadData= {
    //       "inMstType": 29,
    //       "inValue": 0,  
    //       "inValue2": 0,  
    //       "inValue3":this.profileDetails.employeeCode
    //     }
    //     this.apiService.post('allmstdata',payloadData).subscribe((res:any)=>{
    //       this.resData=JSON.parse(res.data)
    //       console.log( this.resData)
    //       console.log(this.resData[0].vInIsAutoapprove)

    //   if (this.resData[0].vInIsAutoapprove == 1) {
    //         // alert("Welcome To Commutation !!!")
    //         this.router.navigate(['/CommutationRequests']); // Redirect to page1
    //       } else {
    //         alert("You are not applicable for commutation!!!")

    //       }
    //     })
    //   }else
    //   {

    //   }

    // }

  }


}
