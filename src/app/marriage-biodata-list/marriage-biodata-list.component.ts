import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-marriage-biodata-list',
  templateUrl: './marriage-biodata-list.component.html',
  styleUrls: ['./marriage-biodata-list.component.scss']
})
export class MarriageBiodataListComponent implements OnInit {
  displayedColumns: string[] = ['image', 'name', 'fatherName', 'age', 'occupation', 'contact', 'resume'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getListBiodata();
  }
  jsonData:any[]=[]
  getListBiodata() {
    this.apiService.post("marriageBiodata", { "requestJson": { "inType": 2 } }).subscribe((res: any) => {

      if (JSON.stringify(res).includes("id")) {
        this.jsonData = JSON.parse(res?.data[0]?.marriage_biodata_json);
        this.getbase64image(this.jsonData);
         this.getbase64pdf(this.jsonData)
        console.log("jsondata", this.jsonData);
        this.dataSource = new MatTableDataSource(this.jsonData);
      }
    })
  }
  getbase64image(list:any[])
{
  list.forEach((element:any,i:any) => {  
      let uploadfiledata = {
        requestJson: {
           inType: 2,
           docId:element?.image
        },
      };

    this.apiService.post('uploadFiles', uploadfiledata).subscribe({
        next: (res: any) => {
 console.log("res",res);
 if(JSON.stringify(res).includes('filetype'))
 {
  
   this.jsonData[i]['imageBase64']=res.data[0].filedata;
    console.log("base64Array",this.jsonData);
 
 }
        },
        error: () => {
        
        },
      });
      });
}
  getbase64pdf(list:any[])
{
  list.forEach((element:any,i:any) => {  
      let uploadfiledata = {
        requestJson: {
           inType: 2,
           docId:element?.resume
        },
      };

    this.apiService.post('uploadFiles', uploadfiledata).subscribe({
        next: (res: any) => {
 console.log("res",res);
 if(JSON.stringify(res).includes('filetype'))
 {
  
     this.jsonData[i]['pdfBase64']=res.data[0].filedata;
    console.log("base64Array",this.jsonData);

 }
        },
        error: () => {
        
        },
      });
      });
}
  downloadResume(file: string, name: string) {
    const link = document.createElement('a');
    link.href = file; // file is Base64 string (data:application/pdf;base64,...)
    link.download = name;
    link.click();
  }
  routeToUpload() {
    this.router.navigate(['upload-biodata']);
  }
}
