import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  inboxData: any = [];
  displayedColumns: any[] = ['Request ID', 'Initiator', 'Request Description', 'Created Date', 'Received From', 'Status', 'Remarks', 'Action'];
  dataSource!: MatTableDataSource<any>;
  dr_Master!: FormGroup
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isShow:boolean= true;
  error: string = '';
  empinfo: any;
  countDetail: any = [];
  showerror: boolean = false;
  endpoint: any = 'inbox';
  endpoint1: any = 'getRequestCount';
  actionResult: Array<any> = [];
  taskid: any;
  reqId: any;
  processId: any;
  pageUrl: any;
  datalist: any = [];
  outboxCount: any = [];
  draftCount: any = [];
  outboxData: any = [];
  draftData: any = [];
  inbox: any
  DdlShow: any;
  IsEss: any;
  empCount: any = {};
  employeeInboxList: Array<any> = [];
  IsActive = 1;
  IsHoActive = 'INBOX';
  roleId:any;
  isDashboard:boolean=false
  constructor(public dialog: MatDialog, private apiService: ApiService,
    
     private router: Router, private route: ActivatedRoute) { }
    newConfig:AppConfig=new AppConfig();
  ngOnInit(): void {
   
  

   
   
    this.empinfo= this.newConfig.getUserDetails();
    console.log("inbox",this.empinfo);
    // this.IsEss === '1' ? this.displayedColumns.pop() : '';
    this.getEmpCount()
    this.getEmpInboxDetail(2)
    console.log(this.displayedColumns)
  
   
  }
  ngOnDestroy(){
    
  }
  employeeList()
  {
this.router.navigate(['inbox/employee'])
  }
  



  getCount(roleId: any) {
    let data = {
      assignmentId: this.empinfo.aid,
      roleId: roleId,
    }
    this.apiService.postEmployee(this.endpoint1, data).subscribe({
      next: (res:any) => {
        if (res.status === "SUCCESS") {
          if (res == '') {
            alert("Not Record Found");
          }
          else {
            this.countDetail = res.data;
          }
        }
      },
      error: (err) => {

       // this.snackbar.show(err?.error?.description, 'danger')
      },
    })
  }


  getEmpCount() {
    this.apiService.postEmployee('getEmptActionCount', { employeeCode: this.empinfo[0].employeeCode }).subscribe({
      next: (res:any) => {
        if (res.status === "SUCCESS") {
          this.empCount = res.data;
          this.getEmpInboxDetail(2)
        }
      },
      error: (err) => {
        //this.snackbar.show(err?.error?.description, 'danger')
      },
    })
  }

  getEmpInboxDetail(id: number) {

    this.IsActive = id;
    if( id==3 || id==4 || id==5)
    {
      this.isShow=false
    }else{
      this.isShow=true
    }
    if(id==5){
      this.apiService.pension({"flag":3,"pensionerId":1647708},'getNosalIncrementDetails').subscribe({

        next: (res:any) => {
          if (res.status === "SUCCESS") {
            const data = res.data;
           
  
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err) => {
          // this.snackbar.show(err?.error?.description, 'danger')
        },
      })
    }
    this.apiService.postEmployee('getEmptActionCountList', {
      employeeCode: this.empinfo[0].employeeCode,
      type:id
     }).subscribe({
      next: (res:any) => {
        if (res.status === "SUCCESS") {
          const data = res.data;
         

          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        // this.snackbar.show(err?.error?.description, 'danger')
      },
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  View_Profile(requestID: any, taskTranId: any, menuUrl: any,remarks:any) {
    console.log("menu urls on view",menuUrl);
   if(this.IsEss)   
      sessionStorage.setItem('ifm_emp_in', JSON.stringify({ reqId: requestID, taskId: taskTranId,type:remarks}));
      else
      sessionStorage.setItem('ifm_emp_in', JSON.stringify({ reqId: requestID, taskId: taskTranId,type:remarks}));
      switch (menuUrl) {
        case '/ess/profileUpdate':
          this.router.navigate(["pension-ess"]);
          break;
          case '/ess':
            this.router.navigate(["pension-ess"]);
            break;
         
      }
    
  }

  navigateByMenuUrl(menuUrl:any){
    this.router.navigate([menuUrl]);
  }



  doAction = (row: any) => {
    console.log("row details",row)
    this.reqId = row.requestID;
    this.taskid = row.taskTranId;
    this.pageUrl = row.menuUrl;
    this.processId = row.processID;
    this.apiService.postEmployee('task', { taskId: row.taskTranId }).subscribe(result => {
      this.actionResult = result.data.actionData;
  
    })
  }



  updateRequest(requestId: number, taskId: number) {
    this.reqId = requestId;
    this.taskid = taskId;
    this.apiService.postEmployee('task', { taskId: taskId }).subscribe(result => {
      this.actionResult = result.data.actionData;
     
    })
  }

  // history  10/4/2023
  // View_History(reqId: any) {
  //   this.dialog.open(ApproveComponent,
  //     {
  //       maxWidth: '60vw',
  //       maxHeight: 'auto',
  //       width: '100%',
  //       panelClass: 'dialog-w-50',
  //       autoFocus: false,
  //       data: { message: 'View History', id: 1, reqId: reqId }
  //     }
  //   );
  // }
}

