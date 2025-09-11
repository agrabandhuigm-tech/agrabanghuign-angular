import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-dashboard-dialog',
  templateUrl: './dashboard-dialog.component.html',
  styleUrls: ['./dashboard-dialog.component.scss']
})
export class DashboardDialogComponent implements OnInit {
  [x: string]: any;
  displayedColumns: string[] = ['SSOID','requesId','pensionType','actionTaken','LevelType','roleName','remarks'];
  displayedColumns2: string[] = ['refNo','billNo','statusId','statusCode','sanctionNo','billTypeId','billSubTypeId','billDate_billMonth_billYear','budgetHeadId','treasCode','ddoCode','dedAmt','grossAmt'];
  dataSource!: MatTableDataSource<any>;
  pensionData:any[]=[];
  employeeData:any;
  empCode:any;
  id:any;
  msg:any;
  manual:any;
  dialogText:any;
  message:any;
  title:any
  displayedColumns1: string[] = ['employeeCode','name','designationName','dateOfJoining','dateOfRetirement','PensionType'];
  dataSource1!: MatTableDataSource<any>;
  base64:any;
  billCount:any;
  selectedDate:any;
  pkData:any[]=[];
  @Output() actionEvent = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,
  public common:CommonService,
  private dialogRef: MatDialogRef<DashboardDialogComponent>,private load:LoaderService) { }

  ngOnInit(): void {
    console.log(this.data)
    this.empCode=this.data?.empCode;
    this.id=this.data?.id;
    this.message =this.data?.message;
    this.title =this.data?.title;
    this.pkData=this.data?.pkDocList;
   
    this.dialogText = this.data.dialogText;
    if(this.id==5 )
    {
      this.msg=this.data.msg;
    
    } else if(this.id==4 )
      {
        console.log(this.data.message.base64Pdf)
    this.base64="data:image/jpeg;base64,"+this.data.message.base64Pdf
      }
    
      
    
    

  }
  displayData:any[]=[]
  billData:any[]=[];
  pageNo:any=1;
  pageSize:any=25;
  isPre:boolean=false;
  isNext:boolean=false;
  totalRecord:any=0;
  pageSizeList:any[]=[10,25,50,100,500]
 
  totalShowData:any=0



  showData(data:any,colName:any)
  {
return data[colName]
  }


 
  PreviewVideo(link:any)
  {
    window.open(link, '_blank');
  }
  finalclose()
  {

  }
  confirmdialog(action:any)
  {
    this.dialogRef.close(action);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAction(data:any) {
    this.actionEvent.emit(data);
  }
  
}
