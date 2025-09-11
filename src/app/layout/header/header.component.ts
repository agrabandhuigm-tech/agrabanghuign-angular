import { Component, HostListener, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import * as menu1 from '../../translations/menu.json';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonDialogueBoxComponent } from 'src/app/main/common-dialogue-box/common-dialogue-box.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  innerWidth: string | undefined;
  roleList: any[] = [];
  Role: any = '';
  config: AppConfig = new AppConfig();
  userName: any = "";
  assignmentid: any;
  mevuUrl: any;
  showFiller = false;
  menuList: any;
  assignid: any;
  headershow: boolean = true;
  pensionerInfoResult: any;
  userDetails: any;
  ssoInfo: any;
  profileDetails: any;

  constructor(public authService: AuthService,
    public commonService: CommonService,
    private router: Router,
    public dialog: MatDialog,
    public apiurl: ApiUrlService,
    public api: ApiService,
    private dashboardService: DashboardService,

    private actRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    let ssodata: any = localStorage.getItem('ssoid');
    this.ssoInfo = this.config.getDecodedAccessToken(ssodata);

    this.dashboardService.getLoggedIn().subscribe(value => {
      // this.getProfileDetails();  

    });
    // this.getProfileDetails();
    // if(ssodata)
    // this.getProfileDetails()
    this.getProfileDetails$()
  }

  redirecttopensioEss() {
    // sessionStorage.setItem('landtoken','1');
    // this.config.storeDetails("isess","1")
    // this.router.navigate(['pension-ess']);
  }
  openMenu(): void {
    document.getElementById("sidebar")!.style.display = "block";
  }

  onLogout() {
    this.authService.logout();
  }



  getProfileDetails() {
    var url = this.apiurl.url.getprofiledetails;
    let ssodata: any = localStorage.getItem('ssoid');

    this.ssoInfo = this.config.getDecodedAccessToken(ssodata);
    var data = {
      "ssoId": this.ssoInfo.ssoId
    };
    console.log("myData>>", data);
    this.api.postpension(url, data).subscribe((res: any) => {
      console.log("result>>>", res);
      if (res.data && res.data.length > 0) {
        this.pensionerInfoResult = res.data[0];
        //   console.log("Header Pensioner data ",this.pensionerInfoResult)

        let encData: any = this.config.encrypt(JSON.stringify(res.data));
        // console.log(encData)
        localStorage.setItem('profileDetails', encData);
        this.commonService.personalProfileDetails.next(encData)

      }

    })

  }



  getProfileDetails$() {
    // console.log(this.ssoInfo.ssoid)
    // var url = this.apiurl.url.getprofiledetails;
    //  alert("header")

    this.profileDetails = '';
    this.commonService.personalProfileDetails.subscribe((res: any) => {
      if (res) {
        let details = res

        let decDetails = this.config.decrypt(details);
        this.pensionerInfoResult = JSON.parse(decDetails)
        this.pensionerInfoResult = this.pensionerInfoResult[0]



        // console.log(this.pensionerInfoResult, "pensionerInfoResult ")
        // console.log
        // this.getSsoId =  JSON.parse(decDetails);
        // console.log("profile details without service>>>>", this.getSsoId[0])

        // this.profileDetails= this.getSsoId[0];
        // console.log("profile details without service1>>>>", this.profileDetails)
      }
    })
  }


  @HostListener('window:scroll', [])
  onWindowScroll(event: Event) {
    //set up the div "id=nav"
    if (document.body.scrollTop > 40 ||
      document.documentElement.scrollTop > 40) {
      document.getElementById('myHeader')!.classList.add('sticky');
    }
    else {
      document.getElementById('myHeader')!.classList.remove('sticky');
      this.innerWidth = 'auto';
    }
  }

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
}







