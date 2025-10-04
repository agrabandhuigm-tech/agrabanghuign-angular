import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

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
  getListBiodata() {
    this.apiService.post("marriageBiodata", { "requestJson": { "inType": 2 } }).subscribe((res: any) => {

      if (JSON.stringify(res).includes("id")) {
        let jsondata = JSON.parse(res?.data[0]?.marriage_biodata_json);
        console.log("jsondata", jsondata);
        this.dataSource = new MatTableDataSource(jsondata);
      }
    })
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
