import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-file-status',
  templateUrl: './file-status.component.html',
  styleUrls: ['./file-status.component.scss']
})
export class FileStatusComponent implements OnInit {
  requestType:any;
  isNotInitaite:boolean=false;
  isDetails:boolean=false;
  empCode: any;
  empID: any
  ComEmpCode: any;
  gpoBill: any;
  cpoBill: any;
  arrearGpoBill: any;
  arrearCpoBill: any;
  ePensionData:any;
  arrearData: any;
  rPensionData:any;
  displayedColumns: string[] = ['SSOID', 'requesId', 'assigneeName','actionTaken', 'LevelType', 'roleName', "date1",'remarks'];
  pensionDisplayedColumns: string[] = ['requestId',
'reqDesc',
'pendingAt',
'forwardedBy',
'status',
'remarks',
'createdDate','View'];
pensionviewDisplayedColumns: string[] = ['taskTransId',
'requestId',
'roleName',
'actionTakenBy',
'actionTaken',
'remarks',
'createdDate'];
  pensionViewDataSource!: MatTableDataSource<any>;
  displayedColumns2: string[] = ['No',"Ref No","Bill Date",'utrNo'];
  pensionNotIniDataSource!: MatTableDataSource<any>;
  displayedColumnsNotIni: string[] = ["ssoId",'displayName',"taskRoleName"];
  dataSource!: MatTableDataSource<any>;
  dataSource1!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;
  dataSource3!: MatTableDataSource<any>;
  pensionDataSource!: MatTableDataSource<any>;
  arrearGpoDataSource!: MatTableDataSource<any>;
  arrearCpoDataSource!: MatTableDataSource<any>;
  arrearDataSource!: MatTableDataSource<any>;
  @ViewChild('ess') ess!: MatPaginator;
  @ViewChild('pension') pension!: MatPaginator;
  @ViewChild('pension1') pension1!: MatPaginator;
  @ViewChild('pension2') pension2!: MatPaginator;
  @ViewChild('pension3') pension3!: MatPaginator;
  @ViewChild('pensionNew') pensionNew!: MatPaginator;
  @ViewChild('pensionNewIni') pensionNewIni!: MatPaginator;
  @ViewChild('pensionNewView') pensionNewView!: MatPaginator;
  @ViewChild('arrear') arrear!: MatPaginator;
  @ViewChild('arrearGpo') arrearGpo!: MatPaginator;
  @ViewChild('arrearCpo') arrearCpo!: MatPaginator;
  constructor(public _Service: ApiService, public dialog: MatDialog,public common:CommonService) { }
  user: any;
  ngOnInit(): void {
   
    this.user = this._Service.userInfo();
    console.log( "info",this.user)
    this.empCode = this.user?.employeeId;
    this.filterData('pension-status');
  }
 
  essData: any[] = [];
  pensionData: any[] = [];
  arrearStatusList: any[] = [];
  employeeData: any;
  filterData(type: string) {
    if (this.empCode == '' || this.empCode == null) {
      alert("Please Enter Employee Code");
      return;
    }
    this.getEmployeeData(1)
    if(type == 'pension-file-status'){
      this.pensionList();
    
    }else  if(type == 'pension-status'){
      this.isDetails=false;
      this.getPensionStatus();
    }
    // this.esslistdata();
  }
 
  pensionList() {
    let data = {
      "employeeCode": this.empCode
    }

    this._Service.pension( data,'getpensionfilestatus').subscribe((res: any) => {

      if (res.status == "SUCCESS") {
        console.log(res.data)
        let data = res.data;
        if (data.length > 0) {
          data = data.sort();
          data = data.reverse()
          console.log("data", data)
        }
        this.pensionData = data;
        if(this.pensionData.length>0)
        {
          
          let gpobill=this.pensionData[0].rspgpo;
          console.log("gpobill",gpobill)
          if(gpobill)
          {
            this.gpoBill=JSON.parse(gpobill);
            console.log("gpobill",this.gpoBill)
            this.gpoBill=this.gpoBill.reverse();
            console.log("gpobill",this.gpoBill)
            this.dataSource1 = new MatTableDataSource(this.gpoBill);
            setTimeout(() => this.dataSource1.paginator = this.pension2);
           
            
          }
          let cpoBill=this.pensionData[0].rspcpo;
          console.log("gpobill",cpoBill)
          if(cpoBill)
          {
            this.cpoBill=JSON.parse(cpoBill);
            this.cpoBill=this.cpoBill.reverse();
            this.dataSource2 = new MatTableDataSource(this.cpoBill);
            setTimeout(() => this.dataSource2.paginator = this.pension3);
          }
        }
        let epension:any=this.pensionData.filter((x:any)=>x.processId=='1');
        this.ePensionData=epension;
        this.dataSource = new MatTableDataSource(epension);
        setTimeout(() => this.dataSource.paginator = this.pension);
        let rpension:any=this.pensionData.filter((x:any)=>x.processId=='2');
        this.rPensionData=rpension;
        this.dataSource3 = new MatTableDataSource(rpension);
        setTimeout(() => this.dataSource3.paginator = this.pension1);
        console.log("rpension",rpension)
        
      }


    })
  }
  getEmployeeData = (id:any) => {
    let data={
      "inType": 20,
      "employeeCode": this.empCode
    }
    console.log("data",data)
    this._Service.postNewEmployee("getPensionRevertEmpDetails",data).subscribe((res:any)=>{
      console.log("employee data",res)
      if(JSON.stringify(res).includes('employeeOtherDetails'))
      {
        this.employeeData = res.data.employeeOtherDetails[0];
        if(id==2)
        {
          this.findFPEnsionData()
        }
      }
      
    },(error)=>{
      
    })
    // this._Service.postNewEmployee('getEmployeeDetailsByType', {
    //   employeeId: this.empCode, inType: 8
    // }).subscribe({
    //   next: res => {
    //     console.log("res", res.data.employeeOtherDetails[0])
    //     this.employeeData = res.data.employeeOtherDetails[0]
    //   }, error: err => {
    //   }
    // })
  }


  View_Objection(reqId: any,processId:any) {
    if(reqId)
    {
      if (processId==1 || processId==2 ) {
        // this.dialog.open(CommonDialogComponent,
        //   {
        //     maxWidth: '60vw',
        //     maxHeight: 'auto',
        //     width: '100%',
        //     panelClass: 'dialog-w-50', autoFocus: false
        //     , data: {
        //       message: 'View Objection', id: 20, reqId: reqId.toString(),processId:processId
        //     }
        //   }
        // );
      }
      //  else if(processId==9)
      //   {
      //     this.dialog.open(CommonDialogComponent,
      //       {
      //         maxWidth: '60vw',
      //         maxHeight: 'auto',
      //         width: '100%',
      //         panelClass: 'dialog-w-50', autoFocus: false
      //         , data: {
      //           message: 'View Objection', id: 31, reqId: reqId.toString(),processId:processId
      //         }
      //       }
      //     );
      //   }
        // else if(processId==3 || processId==6)
        //   {
        //     this.dialog.open(CommonDialogComponent,
        //       {
        //         maxWidth: '60vw',
        //         maxHeight: 'auto',
        //         width: '100%',
        //         panelClass: 'dialog-w-50', autoFocus: false
        //         , data: {
        //           message: 'View Objection', id: 23, reqId: reqId.toString(),processId:processId
        //         }
        //       }
        //     );
        //   }
          else
        (
          alert("For this process Objection not view here.")
        )
    }else
    (
      alert("Request id not present.")
    )
    

  }
  esslistdata() {
    let data = {
      "employeeCode": this.empCode
    }

    this._Service.postEmployee('getemployeefilestatus', data).subscribe((res: any) => {
      // console.log("empdata",res)
      if (res.status == "SUCCESS") {
        console.log("empdata", res.data)
        let data = res.data;
        if (data.length > 0) {
          data = data.sort();
          data = data.reverse()
          console.log("data", data)

          this.essData = data;
          this.dataSource1 = new MatTableDataSource(data);
          this.dataSource1.paginator = this.ess;
        } else {
          let data: any[] = []
          this.essData = data;
          this.dataSource1 = new MatTableDataSource(data);
          this.dataSource1.paginator = this.ess;
        }
      }


    })

  }
  findFPEnsionData()
  {
    let data = {
      "employeeId":  this.employeeData.employeeId
    }

    this._Service.pension(data,'getFamilyPensionFileStatus').subscribe((res: any) => {

      if (res.status == "SUCCESS") {
        console.log(res.data)
        debugger
        let data = res.data;
        if (data.length > 0) {
          data = data.sort();
          data = data.reverse()
          console.log("data", data)
        }
        this.pensionData = data;
        if(this.pensionData.length>0)
        {
          let gpobill=this.pensionData[0].rspgpo;
          if(gpobill)
          {
            gpobill=JSON.parse(gpobill);
         
            gpobill=gpobill.reverse();
            this.gpoBill=gpobill
            this.dataSource1 = new MatTableDataSource(gpobill);
            setTimeout(() => this.dataSource1.paginator = this.pension2);
           
            
          }
          let cpoBill=this.pensionData[0].rspcpo;
          if(cpoBill)
          {
            cpoBill=JSON.parse(cpoBill);
            cpoBill=cpoBill.reverse();
            this.cpoBill=cpoBill
            this.dataSource2 = new MatTableDataSource(this.cpoBill);
            setTimeout(() => this.dataSource2.paginator = this.pension3);
          }
        }
       
        this.ePensionData=this.pensionData;
        this.dataSource = new MatTableDataSource(this.pensionData);
        setTimeout(() => this.dataSource.paginator = this.pension);
     
     
        
      }


    })
  }
  onTabMainChanged(index:any)
{
  console.log("index",index.index)
 
    let data:any=[]
    this.dataSource1 = new MatTableDataSource(data);
    setTimeout(() => this.dataSource1.paginator = this.pension2);
    this.pensionData=data;
    this.dataSource = new MatTableDataSource(data);
    setTimeout(() => this.dataSource.paginator = this.pension);
  this.empCode=null;
  this.employeeData=null;
  this.cpoBill=data;
  this.gpoBill=data;
}
currentPensionKit:any='0';
getPensionStatus()
{
  let data ={
    'employeeCode':this.empCode,
    "type": "I"
}

  this._Service.postho('getNewPsnFileStatus', data).subscribe((res: any) => {
console.log("res",res)
if(JSON.stringify(res).includes("processId"))
{
this.pensionDataSource=new MatTableDataSource(res.data);
this.pensionDataSource.paginator=this.pensionNew;
this.currentPensionKit=res.data[0].CurrentPsnKitId!=null?res.data[0].CurrentPsnKitId:'0';
}else{
  let data:any=[]
  this.pensionDataSource=new MatTableDataSource(data);
  this.pensionDataSource.paginator=this.pensionNew
}
  })
}
getDetailsByRequestId(req:any)
{
  let data ={
    'requestId':req,
    "type": "T"
}

  this._Service.postho('getNewPsnFileStatus', data).subscribe((res: any) => {
console.log("res",res)
if(JSON.stringify(res).includes("requestId"))
{
  this.pensionViewDataSource=new MatTableDataSource(res.data);
  setTimeout(() => {

    this.pensionViewDataSource.paginator=this.pensionNewView;
  }, 200);

  this.isDetails=true;
  }else{
    let data:any=[]
    this.pensionViewDataSource=new MatTableDataSource(data);
    this.pensionViewDataSource.paginator=this.pensionNewView
}
  })
}
reset()
{
  this.isDetails=false;
  this.isNotInitaite=false;
  this.isBillDetails=false;
}
notInitiateYet()
{
  if(this.requestType!=5)
  {
    let data ={
      'employeeCode':this.empCode,
      "type": "N",
      "requestType":this.requestType
  }
  
    this._Service.postho('getNewPsnFileStatus', data).subscribe((res: any) => {
  console.log("res",res)
  if(JSON.stringify(res).includes("displayName"))
  {
  this.pensionNotIniDataSource=new MatTableDataSource(res.data);
  // this.pensionNotIniDataSource.paginator=this.pensionNew
  }else{
    let data:any=[]
    this.pensionNotIniDataSource=new MatTableDataSource(data);
    // this.pensionNotIniDataSource.paginator=this.pensionNew
  }
    })
  }else
  {
    this.getPensionInitiateoffice();
  }

}
notIni()
{
  if(this.empCode)
  {
    this.isNotInitaite=true;
  }else
  {
    this.common.openErrorModal("Please insert Employee Code.","")
  }
}
billRecord:any;
isBillDetails:boolean=false;
billDetails()
{
  if(!this.empCode)
    {
      this.common.openErrorModal("Please insert Employee Code.","");
      return;
    }
  let data = {
    "inMstType": 5,
    "employeeCode": this.empCode
  }
  this.isBillDetails=true;
  this._Service.pension(data, "workMultiTask").subscribe((res: any) => {
   
    console.log("bill", res);
    if (res.data) {
      if (JSON.stringify(res.data).includes("refNo")) {

        this.billRecord = JSON.parse(res.data);
        console.log("this.billRecord", this.billRecord);
        this.billRecord.forEach((element: any) => {
          console.log("gpoPayAmount", element);
          if (element.isActive == 'Y') {
            if (element.billSubType == 4) {
              // this.cpoPayAmount = this.cpoPayAmount + Number(element.netAmt)
            }
            if (element.billSubType == 3) {
              // this.gpoPayAmount = this.gpoPayAmount + Number(element.netAmt)
              
            }
          }
        })
      } else {
        this.billRecord = [];
      }
    } else {
      this.billRecord = [];
    }

  }, (error) => {
    alert("get bill record service not work.")
  })
}
billDetails2()
{
  if(!this.empCode)
    {
      this.common.openErrorModal("Please insert Employee Code.","");
      return;
    }
  let data = {
    "inMstType": 3,
    "employeeCode": this.empCode
  }
  this.isBillDetails=true;
  this._Service.postpension( "psnCommonService",data).subscribe((res: any) => {
   
    console.log("bill", res);
    if (res.data) {
      if (JSON.stringify(res.data).includes("refNo")) {

        this.billRecord = res.data;
        console.log("this.billRecord", this.billRecord);
        this.billRecord.forEach((element: any) => {
          console.log("gpoPayAmount", element);
         
        })
      } else {
        this.billRecord = [];
      }
    } else {
      this.billRecord = [];
    }

  }, (error) => {
    alert("get bill record service not work.")
  })
}
getPensionInitiateoffice()
  {
    console.log(this.employeeData)
    let data={
      "employeeId": this.employeeData?.employeeId,
      "inType": 14
    }
    console.log("data",data)
    this._Service.empServicese("insertPsnEmpCommon",data).subscribe((res:any)=>
    {
      console.log("pOffice",res)
      if(res.data)
      {
     if(res?.data?.pensionIniOffice!="0")
     {
     
      let data ={
        'officeId':res?.data?.pensionIniOffice,
        "type": "N",
        "requestType":this.requestType
    }
    
      this._Service.post('getNewPsnFileStatus', data).subscribe((res: any) => {
    console.log("res",res)
    if(JSON.stringify(res).includes("displayName"))
    {
    this.pensionNotIniDataSource=new MatTableDataSource(res.data);
    // this.pensionNotIniDataSource.paginator=this.pensionNew
    }else{
      let data:any=[]
      this.pensionNotIniDataSource=new MatTableDataSource(data);
      // this.pensionNotIniDataSource.paginator=this.pensionNew
    }
      })
     }
      }
    },(error)=>{
        alert("Error in revisionflag service");
    })
   
  }
  ngAfterViewInit() {
    this.pensionViewDataSource.paginator = this.pensionNewView;
    this.pensionDataSource.paginator = this.pensionNew;
  }
}