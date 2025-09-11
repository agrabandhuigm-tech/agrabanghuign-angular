import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatPaginator } from '@angular/material/paginator';
import { PdfPreviewComponent } from '../../pension-related-request/ess/pdf-preview/pdf-preview.component';

@Component({
  selector: 'app-life-certificate-details',
  templateUrl: './life-certificate-details.component.html',
  styleUrls: ['./life-certificate-details.component.scss']
})
export class LifeCertificateDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedYear:any;
  empinfo: any = {};
  showTransTable: boolean = true;
  yearList:any[]=[];
  displayedColumns: string[] = ['ppoNo', 'created_date', 'emp_name', 'pen_id','remark', 'view_action'];
  LifeCertTableDataSource: MatTableDataSource<any>;
  constructor(    private essService: ApiService,
        public dialog: MatDialog,
        private snackbar: SnackbarService) {

    this.essService.configMenu = { IsShow: true }
    
   }

  ngOnInit(): void {
    this.essService.configMenu = { IsShow: true }
    this.empinfo = this.essService.userInfo();
  
    console.log(this.empinfo);
    this.getYearList()
  }

  getYearList()
  {
    let date=new Date();
    let currentyear=date.getFullYear();
    this.selectedYear=currentyear;
    this.yearList.push(currentyear);
    for(let i=1;i<=2;i++)
    {
      let currentyear=date.getFullYear()-i;
      this.yearList.push(currentyear);
    }
    console.log("selectedYear",this.selectedYear)
    this.getLifeCertificatedata();
  }
  getLifeCertificatedata() {
    let data = {
      "officerOfficeId": this.empinfo.userId ? this.empinfo.userId : 0,
      "inYear":this.selectedYear
    }
    console.log("selectedYear",data)
    this.essService.pension(data, 'getLifeCertificateDetailsByOfficeId').subscribe((res: any) => {
    
      if(JSON.stringify(res).includes('ppoNo'))
      {
        this.LifeCertTableDataSource=new MatTableDataSource(res.data);
        this.LifeCertTableDataSource.paginator=this.paginator; 
      }else
      {
        let data:any=[];
        this.LifeCertTableDataSource=new MatTableDataSource(data);
      }
     
   
    })
  }


  getDocumentFile = (id: any) => {
    let data = {
      "type": "data",
      "sourceId": 2,
      "docs": [
        {
          "docId": id
        }
      ]
    }
    console.log("single report data", data)
    this.essService.postIntegration('wcc/getfiles', data).subscribe({
      next: res => {
        if(res.data.document[0].content)
        {
          console.log("res", res.data.document[0].docName)
          let extension: any
          extension = "data:application/pdf;base64,"
          console.log("file exeeee", res.data.document[0].content);
          let mainData = extension + res.data.document[0].content;
          console.log("mainData", mainData)
          let data = {
            "base64Pdf": mainData,
            "redirectUrl": "/ess/profileUpdate/lifeOtherCertificate",
          }
          console.log("data", data);
          this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
  
        }else
        {
   
          alert("Preview Not avaiable")
        }
        
      }, error: err => {
        this.snackbar.show(err.error.description, 'danger')
      }
    })
  }

}
