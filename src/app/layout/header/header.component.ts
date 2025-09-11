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
import { CommonDialogueBoxComponent } from 'src/app/pensioner/common-dialogue-box/common-dialogue-box.component';
import { ItmsRedirectService } from 'src/app/services/itms-redirect.service';

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
  profileDetails:any ;

  constructor(public authService: AuthService,
     public commonService: CommonService, 
     private router: Router, 
     public dialog: MatDialog,
     public apiurl: ApiUrlService,
      public api: ApiService,
      private dashboardService:DashboardService,
    private itmsRedirectService: ItmsRedirectService,
      private actRoute: ActivatedRoute) 
      {    
        
     }
     pensionerData: any 
  ngOnInit(): void {

    let ssodata: any = localStorage.getItem('ssoid');
    this.ssoInfo =  this.config.getDecodedAccessToken(ssodata);
    let details = sessionStorage.getItem('userDetails');
    if(details)
      {
        let data=JSON.parse(this.config.decrypt(details))
        this.pensionerData=data[0]
      }
    this.dashboardService.getLoggedIn().subscribe(value => {  
      // this.getProfileDetails();  
  
     });
    // this.getProfileDetails();
    // if(ssodata)
      // this.getProfileDetails()
      this.getProfileDetails$()
  }
  
  ItmsDashboardRedirection = () => {
  
    let payload:any = [
      { 
        key: 'service', 
        value: 'PEN',
      },
      { 
        key: 'ppono', 
        value: this.pensionerData?.ppoNo,
      },
      { 
        key: 'accno', 
        value: this.pensionerData?.accNo.slice(-4), //last 4 no.s of account number
      },
    ]
    this.itmsRedirectService.itmsRedirectPost(payload);
  }
  redirectToInbox()
{
  this.router.navigate(['inbox']);
}
gotoUrl(url: string) {
  this.router.navigate([url]);
 
}
  backToSpace(){
    debugger;
    const ifmsssourl = `${window.location.origin+this.apiurl.devUrl}/#/selectspace`;
    console.log(ifmsssourl)
    window.location.href = ifmsssourl;

  }

  changeDeskAndRole(){
    const ifmsssourl = `${window.location.origin+this.apiurl.devUrl}/#/selectspace`;
    window.location.href = ifmsssourl;
    // const ifmsssourl = `${window.location.origin}/ifmssso/#/userhome`;
    // window.location.href = ifmsssourl;
  }

  redirecttopensioEss()
  {
    let data={
      "employeeId": this.pensionerInfoResult.employeeId,
      "inType": 14
    }
    console.log("data",data)
    this.api.postNewEmployee("getPensionRevertEmpDetails",data).subscribe((res:any)=>
    {
      if(res.data)
      {
        if(res.data.ISREVISIONUNDERPROCESS=="Y" || res.data.ISREVISIONUNDERPROCESS=="N" || res.data.ISREVISIONUNDERPROCESS=="M")
        {
         
            sessionStorage.setItem('landtoken','');
            this.config.storeDetails("isess","")
            this.router.navigate(['pension-ess']);
         
         
        }else if(res.data.ISREVISIONUNDERPROCESS=="Z")
        {
          this.dialog.open(CommonDialogueBoxComponent,  
            {data: {
            
              Actiontype:'pensioness',
              getEventStatus: (event: any)=>{console.log(event)
                           
              }
            },         
          });
         
        }
      }
    },(error)=>{
        alert("Error in revisionflag service");
    })
   
  }
  openMenu(): void {
    document.getElementById("sidebar")!.style.display = "block";
  }

  onLogout() {
    // if(confirm("Are you sure you want to log out?"))
    // {
    //   sessionStorage.clear();
    //   localStorage.clear();
    //   let purl: string = this.router['location']._platformLocation.location.origin;
   
    //   window.location.href=purl+this.apiurl.devUrl
    // }

    if(confirm("Are you sure you want to log out?")){
      this.authService.logout();
    }
  }



getProfileDetails(){
   var url = this.apiurl.url.getprofiledetails;
   let ssodata: any = localStorage.getItem('ssoid');
   
   this.ssoInfo =  this.config.getDecodedAccessToken(ssodata);
   var data = {
    "ssoId": this.ssoInfo.ssoId
   };
   console.log("myData>>",data);
   this.api.postpension(url, data).subscribe((res: any) => {
     console.log("result header", res);
     if (res.data && res.data.length > 0) 
     {  
      console.log("result header", res.data);
        this.pensionerInfoResult=res.data[res.data.length-1];  
        console.log("Header Pensioner data ",this.pensionerInfoResult)

        let encData: any = this.config.encrypt(JSON.stringify(res.data));
        // console.log(encData)
        localStorage.setItem('profileDetails', encData);
       this.commonService.personalProfileDetails.next(encData)
      
     }    
   
    })  
 
 }



 getProfileDetails$(){
  // console.log(this.ssoInfo.ssoid)
   // var url = this.apiurl.url.getprofiledetails;
  //  alert("header")
   
  this.profileDetails='';
   this.commonService.personalProfileDetails.subscribe((res:any)=>{
      if(res){
        let details = res
          
          let decDetails = this.config.decrypt(details);
          this.pensionerInfoResult = JSON.parse(decDetails)
          this.pensionerInfoResult = this.pensionerInfoResult[this.pensionerInfoResult.length-1]
        
console.log("header",this.pensionerInfoResult)

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

  comingSoonData()
    {
      this.dialog.open(CommonDialogueBoxComponent,  
        {data: {
        
          Actiontype:"ComingSoon",
          getEventStatus: (event: any)=>{console.log(event)
                       
          }
        },         
      });
  
    }
   
}







