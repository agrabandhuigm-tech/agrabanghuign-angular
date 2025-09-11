import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

const tableData: any[] = [
  {
    document_name: 'Rajasthan Transparency In Public Procurement Rules',
    file_size: '3.97 MB',
    dated: '26/05/2013',
    download: 'Download',
  },
  {
    document_name: 'PWF & AR Vol-III',
    file_size: '3.66 MB',
    dated: '01/07/1999',
    download: 'Download',
  },
  {
    document_name: 'PWF & AR Vol-II',
    file_size: '7.19 MB',
    dated: '01/07/1999',
    download: 'Download',
  },
  {
    document_name: 'PWF & AR Vol-I',
    file_size: '10.03 MB',
    dated: '01/07/1999',
    download: 'Download',
  },
  {
    document_name: 'G.F. & A.R. Volume II- Forms',
    file_size: '2.36 MB',
    dated: '07/09/1993',
    download: 'Download',
  },
  {
    document_name: 'G.F. & A.R. Part III- Delegation Of Financial Powers',
    file_size: '1.10 MB',
    dated: '01/07/1999',
    download: 'Download',
  },
  {
    document_name: 'G.F. & A.R. Part II- Governing Store Purchases Procedures',
    file_size: '1.11 MB',
    dated: '01/07/1999',
    download: 'Download',
  },
  {
    document_name: 'G.F. & A.R. Part I- Fundamental Rules And Procedures',
    file_size: '2.20 MB',
    dated: '01/07/1999',
    download: 'Download',
  },
  {
    document_name: 'Suggestion On Final Drafts Of SBDs',
    file_size: '9.09 MB',
    dated: '01/07/1999',
    download: 'Download',
  },
  {
    document_name: 'Rajasthan Transparency In Public Procurement Act 2012',
    file_size: '417.83 KB',
    dated: '22/05/2012',
    download: 'Download',
  },
  {
    document_name: 'Budget Distribution: Bulk(User Manual)',
    file_size: '1.16 MB',
    dated: '22/05/2012',
    download: 'Download',
  },
  {
    document_name: 'Budget Withdrawal From Other Offices – User Manual',
    file_size: '2085 MB',
    dated: '22/05/2012',
    download: 'Download',
  },

];

@Component({
  selector: 'app-user-mannuals',
  templateUrl: './user-mannuals.component.html',
  styleUrls: ['./user-mannuals.component.scss']
})
export class UserMannualsComponent implements OnInit {

  // mat table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tableDataSource = new MatTableDataSource<any>(tableData);
  displayedColumns: string[] = ['sr_no','document_name','file_size','dated','download'];

  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

}
