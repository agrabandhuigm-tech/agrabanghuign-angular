import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { Constants } from 'src/app/shared/Constants';
import { log } from 'console';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  panelOpenState = false;
  sidemenuactive:boolean[]=[];
  role1:any;
  showMenu:boolean=false;
  innerWidth: string | undefined;
  roleList:any[]=[];
  Role: any = '';
  selectedrole:any;
  rolecount:any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  config: AppConfig = new AppConfig();
  userDetails:any={"role":"","roleid" :"","assignmentid":""};
  assignmentid:any;
  ssoid:any;
  initToken:any;
  ispss:any;
  tokendetails:any;
  pendingTaskCount:any;
  pendingTaskCountbill:any;
  ssoimg:any;
  constructor(public dialog: MatDialog,public router:Router,private actRoute: ActivatedRoute,public authService: AuthService,private route: ActivatedRoute, public commonService: CommonService,public apiurl:ApiUrlService,public api:ApiService) {
    localStorage.setItem('hidemenu','0');
    this.route.queryParams.subscribe((params: any) => {
      
      this.ispss=params['ispss']; 
      sessionStorage.setItem('initToken', this.initToken);
    });    

  }

  ngOnInit(): void {  
  } 
  openMenu():void {
    document.getElementById("sidebar")!.style.display = "block";
  }

  onLogout(){
    this.authService.logout();
  }


}
