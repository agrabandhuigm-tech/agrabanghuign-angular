import { Component, OnInit,ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as menu1 from '../../translations/menu.json';
import menu2 from '../../translations/sidemenu.json'
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';

//import { PensionServiceService } from 'src/app/services/pension-service.service';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  mevuUrl:any;
  showFiller = false;
  menuList:any;
  sideList:any;
  subMenu:any[]=[];
  isSub:boolean[]=[];
  config: AppConfig = new AppConfig();
  Role:any;
  @ViewChild('select') select!: ElementRef;
  selected :string="active";
  changeMenuBackground:boolean[]=[];
  changeSubMenuBackground:boolean[]=[];
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
  constructor(public router:Router,
    public commonService:CommonService,
    public dialog:MatDialog,public service:ApiService) { }
isload:boolean=false;
  ngOnInit(): void {
    this.service.configMenu.subscribe((item: any) => {
      
    this.isload=item.isload;
   alert();
  })
    // this.Role  = this.userDetails.role;
    // console.log("role",this.Role);
    // if(this.Role=='ADMIN')
    // {
    //   this.sideList=menu2;
    //   this.menuList=menu1;
    //   this.menuList=this.menuList.admin;
    //   this.sideList=menu2.admin;
    // }else if(this.Role=='MAKER')
    // {
    //   this.sideList=menu2;
    //   this.menuList=menu1;
    //   this.menuList=this.menuList.maker;
    //   this.sideList=menu2.maker;
    // }else if(this.Role=='APPROVER')
    // {
    //   this.sideList=menu2;
    //   this.menuList=menu1;
    //   this.menuList=this.menuList.approver;
    //   this.sideList=menu2.approver;
    // }else if(this.Role=='CHECKER')
    // {
    //   this.sideList=menu2;
    //   this.menuList=menu1;
    //   this.menuList=this.menuList.chekar;
    //   this.sideList=menu2.chekar;
    // }else if(this.Role=='VENDOR')
    // {
    //   this.sideList=menu2;
    //   this.menuList=menu1;
    //   this.menuList=this.menuList.vendor;
    //   this.sideList=menu2.vendor;
    // }else if(this.Role=='VENDOR-APPROVED')
    // {
    //   this.sideList=menu2;
    //   this.menuList=menu1;
    //   this.menuList=this.menuList.vendor;
    //   this.sideList=menu2.vendor;
    // }else if(this.Role=='DDO')
    // {
    //   this.sideList=menu2;
    //   this.menuList=menu1;
    //   this.menuList=this.menuList.ddo;
    //   this.sideList=menu2.ddo;
    // }
   
    // for(let i=0;i<this.menuList.length;i++)
    // {
    //   this.changeMenuBackground[i]=false;
    //   if(this.menuList[i].sub)
    //   {
    //     this.subMenu[i]=this.menuList[i].sub;
    //     this.isSub[i]=true;
    //     console.log("this.subMenu",this.subMenu[i]);
    //   }else{
    //     this.isSub[i]=false;
    //   }
     
      
    // }
    
    console.log("array",this.menuList);
    console.log(this.router.url);
    if(this.router.url)
    {
      for(let i=0;i<this.menuList.length;i++)
      {
        if(this.menuList[i].url)
        {
          if(this.menuList[i].url==this.router.url)
          { let main:any=i;
            console.log("mmmmmmmmmmmm",i);
            
            localStorage.setItem('menu1',main);
          }
          else
          {
        
          }
        }
      }
    }
    var headMenu=localStorage.getItem('menu1');
    
    console.log("headMenu",headMenu);
    if(headMenu)
    {
     this.changeMenuBackground[Number(headMenu)]=true;

    }
    var Menu=localStorage.getItem('menu2');
    
    console.log("Menu",Menu);
    if(Menu)
    {
     this.changeSubMenuBackground[Number(Menu)]=true;

    }
  }

  
 
  
  // togglesidebar() {
  //   if(this.selected==="active"){
  //   document.getElementById('sidebar')?.classList.add('toggler');
  //   document.getElementById('sidebarbtn')?.classList.add('toggle-sidebar-btn_toggle');
  //   this.selected="inactive";
  //   }
  //   else{
  //   document.getElementById('sidebar')?.classList.remove('toggler');
  //   document.getElementById('sidebarbtn')?.classList.remove('toggle-sidebar-btn_toggle');
  //   this.selected="active";
  //   }
    

  // }
}






// export class ContentComponent implements OnInit {
// // accordian start
// panelOpenState = false;
// url:any
// userDetails:any={"role":"",
//   "roleid" :"",
//  "assignmentid":""};
//  config:AppConfig=new AppConfig();
//   constructor(public service:PensionServiceService,public router:Router) { }

//   ngOnInit(): void {
//     this.userDetails = this.config.getUserDetails();
//     this.url=this.service.url;
// // alert(this.service.mainurl)
//   }
//   nevigateToHomePension()
//   {
   
//     this.router.navigate(['/']);
//   }
//   redirectedtoUpcomingPen()
//   {
//     this.router.navigate(['pension/e-Pension/PensionerList']);
//   }
//   redirectedtoUserRole()
//   {
//     this.router.navigate(['pension/processrole']);
//   }
//   redirectedtoEsign()
//   {
//     this.router.navigate(['pension/e-Pension/pendingEsign']);
//   }
//   redirecttoInfo()
//   {
//     let purl: string = this.router['location']._platformLocation.location.origin;
//     window.location.replace(purl+"/ifmssso/#/moduleinfo");
//     // window.location.reload();
//   }
//   redirectedtoPensioners()
//   {
//     this.router.navigate(['e-Pension/adPensionerList']);
//   }
// }
