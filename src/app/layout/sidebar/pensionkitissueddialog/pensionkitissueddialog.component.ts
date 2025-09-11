import { Component, EventEmitter, Inject, OnInit, Output , ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
import { PdfpreviewComponent } from 'src/app/pensioner/pdfpreview/pdfpreview.component';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pensionkitissueddialog',
  templateUrl: './pensionkitissueddialog.component.html',
  styleUrls: ['./pensionkitissueddialog.component.scss']
})
export class PensionkitissueddialogComponent implements OnInit {

  pensionerId:any;
  selectedDate:any;
  msg:any
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;

  displayedColumns: string[] = ['sNo', 'caseType','PPO','GPO','CPO', 'modifiedDate', 'docId'];


  searchInput:any="";
  @Output() actionEvent = new EventEmitter<void>();
  constructor(public api:ApiService,@Inject(MAT_DIALOG_DATA)public data:any,public apiurl: ApiUrlService,public dialog:MatDialog,
    public commonService:CommonService,public san:DomSanitizer) { }

  ngOnInit(): void {    
    this.getPensionKit()
    //this.pensionerId=Number(this.data.PensionerId.pensionerId);
    //this.selectedDate=this.data.selectedDate
  }
  onClose(): void {
    this.dialog.closeAll();
  }


  pensionKitList: any[] = [];
  pensionKitHStList: any[] = [];
  getPensionKit() {
    let data:any;

      data={
        "docTypeId":34,
        'inType': 1, 
         "pensionerId": Number(this.data.PensionerId.pensionerId),
        "employeeCode": this.data.employeeCode.employeeCode,
        //"pensionerId" : 0,
        //'employeeCode': 'RJJP198417017187'
      
      }
     
    //this.load.show()
    this.api.postpension('getListOfPensionKit',data ).subscribe((res: any) => {
      //this.load.hide();
      if (res.data) {
        let list:any[]=[];
        if(Number(res?.data[0]?.dmsDocId)>0)
        {
          let opk=  {
            "docTypeName": res?.data[0]?.docTypeName,
            "createdDate": res?.data[0]?.createdDate,
            "sNo": 0,
            "dmsDocId": res?.data[0]?.dmsDocId,
            "pensionerId":res?.data[0]?.pensionerId
        }
        list.push(opk);
        }
        console.log('pkList',res?.data[0]?.history)
        this.pensionKitList = list;
               // If history exists, push its contents to pensionKitHStList
               if (res?.data[0]?.history && res?.data[0]?.history.length > 0) {
                this.pensionKitHStList = [...res?.data[0]?.history]; // Push all history items
            } else {
                this.pensionKitHStList = []; // Clear or reset if no history
            }
      }else{
        //this.common.openErrorModal("Some error occured","")
      }
    },(error)=>{
      //this.load.hide();
      //this.common.openErrorModal("Some error occured","")
    })
  }

  // dmsDocId:any;
  // getPensionKitDetails()
  // {
  //   var url = 'getListOfPensionKit';
  //   var data = {
  //     "docTypeId":34,
  //     "inType":1,
  //     "pensionerId": 0,
  //     "employeeCode":"RJJP198417017187"
  //     // "employeeCode": this.data.employeeCode.employeeCode,
  //     // "pensionerId": Number(this.data.PensionerId.pensionerId)
  //   };
  //   this.api.postpension(url, data).subscribe((res: any) => {
  //     console.log("result>>>", res);
  //         this.dataSource=new MatTableDataSource(); 
  //         this.dataSource = res.data[0].history;
  //         this.dmsDocId= res.data.dmsDocId;
        
  //   },(error)=>{
  //   })
  // }

  Previewbydocid(row:any){
debugger;
       let data={
         "type": "pension",
         "sourceId": 2,
         "docs": [
           {
             "docId": row
           }
         ]
       }
       console.log("single report data",data)
       this.api.postIntegration("wcc/getfiles",data).subscribe((res:any)=>{
         console.log("res",res);
         if(res.status == "S"){
            if(res.data.document[0].content)  
            {
              let data={
                "base64Pdf":res.data.document[0].content,
                "redirectUrl":"pensioner/selfservice/pensionselfservice/MyDashboard"
                //"redirectUrl":"pensioner/pssdashboard"
                }      
                  console.log("data",data);
                  const bd = atob(res.data.document[0].content)
                  const ab = new ArrayBuffer(bd.length)
                  const u8A = new Uint8Array(ab)
          
                  for (let i = 0 ; i<bd.length;i++) {
                    u8A[i] = bd.charCodeAt(i);
                  }
                  
                  let blob = new Blob([u8A], {type:'application/pdf'});
                    let pdfUrl:any = this.san.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
                    window.open(pdfUrl["changingThisBreaksApplicationSecurity"], '_blank')
              // this.dialog.open(PdfpreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
              
            }
            else{
              alert("Unable to download. The content item is no longer in the system.");
            }
         }
        else{
          alert("Unable to download. The content item is no longer in the system.");
        }
   })
   }
   

  onAction(data:any) {
    this.actionEvent.emit(data);
  }
}
