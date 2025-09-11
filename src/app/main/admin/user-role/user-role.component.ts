import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

import { MenuElement, UserDetail } from 'src/app/model/testdata';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import {MatDialog} from '@angular/material/dialog';
 import { AddUserRoleComponent } from '../add-user-role/add-user-role.component';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AppConfig } from 'src/app/app.config';
@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})

export class UserRoleComponent implements OnInit, AfterViewInit {
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
 config: AppConfig = new AppConfig();
  UserDataList:any[]=[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: string[] = [ 'officeName', 'mobileNo', 'level', 'workScope', 'office', 'designation', 'role', 'post', 'mainCharge', 'showRole'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;


  constructor(  public api:ApiService,
    public apiurl:ApiUrlService,
    private load:LoaderService, public dialog:MatDialog ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.userDetails=this.config.getUserDetails();
    this.getuserassign();
  }

  searchBySSOId(ssoid: any){
    console.log(ssoid);
  }

  applyFilter(event: any) {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = event.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openRoleDialog(item:any){
    this.dialog.open(AddUserRoleComponent,
      {
        height: '60%',
        width: '60%',
        data: {message:item , assignmentId:this.userDetails.assignmentid }
      },
      
      );
  }

  getuserassign()
  {
    var url=this.apiurl.url.getuserassign;
   var data={    
    "assignmentId":this.userDetails.assignmentid
    };
  
    // this.load.show();
    this.api.post(url,data).subscribe((res: any) => {
          console.log("userAssignList",res);
      if(res.status=='SUCCESS')
      {
        let data:any= JSON.parse(res.data);
        
        data=data.UserDetail;
        console.log("user details",data);
        this.dataSource = new MatTableDataSource(data);
      }
    })
  }
}

