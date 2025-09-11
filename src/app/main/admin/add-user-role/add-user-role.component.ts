import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MenuElement } from 'src/app/model/testdata';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AppConfig } from 'src/app/app.config';
@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})

export class AddUserRoleComponent implements OnInit, AfterViewInit {
  UserDataList: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: string[] = ['SR.NO.', 'Role', 'Remove'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  RolesList: any = [];
  processList: any;
  levelList: any;
  roleList: any;
  processId: any;
  roleId: any;
  assignroleList: any
  private paginator1!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator1 = mp;
    this.dataSource.paginator = this.paginator1;
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: { assignmentId: string, message: any },
    public api: ApiService,
    public apiurl: ApiUrlService,
    private load: LoaderService) {
    console.log("data", this.data.message.ASSIGNMENT_VALUE);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.getwfprocess();
    this.getAssignrolelist();
  }


  submitAddRole(role: any) {
    if (role) {
      alert("submit!!");
    } else {
      alert("Please add Role!!");
    }
  }

  applyFilter(event: any) {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = event.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUserDetails() {
    var url = this.apiurl.url.getstate;
    var data = {};
    console.log(url);
    // this.load.show();
    this.api.get(url).subscribe((res: any) => {
      this.load.hide();
      console.log("result", res);
      if (res.status == 'SUCCESS') {
        this.UserDataList = res.data;
        // this.dataSource = new MatTableDataSource(res.data)
      }
    })

    this.UserDataList = [{
      sr_No: '1',
      officer_name: 'Suresh Kumar',
      mobile_no: '95665665656',
      level: 'District',
      work_space: 'jaipur',
      office: 'Deputy Director Horticulture Jaipur',
      designation: 'Agriculture officer horticulture - 1',
      role: 'Agriculture Officer Dist',
      post: 'Agriculture Officer Dist Horticulture - 1'
    }]

    this.dataSource = new MatTableDataSource(this.UserDataList);
  }


  getwfprocess() {
    var url = this.apiurl.url.getwfprocess;
    var data = { };

    // this.load.show();
    this.api.post(url, data).subscribe((res: any) => {

      console.log("process", res);
      if (res.status == 'SUCCESS') {
        this.processList = res.data;
      }
    })
  }

  getwflevel(i: any) {
    this.processId = i;
    console.log(i);
    var url = this.apiurl.url.getwflevel;
    var data = {
      "processId": this.processId
    }
    // this.load.show();
    this.api.post(url, data).subscribe((res: any) => {
      console.log("levelList", res);
      if (res.status == 'SUCCESS') {
        this.levelList = res.data;
      }
    })
  }
  getmstworktask(i: any) {
    console.log("process id", i);
    var url = this.apiurl.url.getmstworktask;
    var data = {
      "processLevelId": i
    }
    // this.load.show();
    this.api.post(url, data).subscribe((res: any) => {

      console.log("roleList", res);
      if (res.status == 'SUCCESS') {
        this.roleList = res.data;
      }
    })
  }
  getRoletask(i: any) {
    this.roleId = i;
  }
  assignRole() {
    var data = {
      "assignData": {
        "processid": this.processId,
        "processtaskid": this.roleId,
        "assignmentid": this.data.message.Assignment_id,
        "assignmentby": this.data.message.Assignment_id,
        "userno": this.data.assignmentId
      }
    }
    console.log("add role data", data);
    let url = this.apiurl.url.addrole;
    this.api.post(url, data).subscribe((res: any) => {

      console.log("role data", res);
      this.getAssignrolelist();
    })
  }
  getAssignrolelist() {

    var data = {
      "assignmentId": this.data.message.assignmentId
    }

    console.log("role data", data);
    let url = this.apiurl.url.gettaskrolenamebyuser;
    this.api.post(url, data).subscribe((res: any) => {
      this.assignroleList = res.data;
      console.log("Assign role data", this.assignroleList);
      this.dataSource = new MatTableDataSource(this.assignroleList)
    })
  }
  removeRole(item: any) {

    var data = {
      "processId": item.processId,
      "processTaskId": item.processTaskId,
      "assignmentId": item.assignmentId
    }
    if (confirm("Are you sure you want to remove?")) {
      console.log("remove role data", data);
      let url = this.apiurl.url.removeassignrole;
      this.api.post(url, data).subscribe((res: any) => {

        console.log("remove", res);
        this.getAssignrolelist();
      })
    }
  }
}

