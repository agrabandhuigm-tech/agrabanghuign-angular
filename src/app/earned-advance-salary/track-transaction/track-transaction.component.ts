import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-track-transaction',
  templateUrl: './track-transaction.component.html',
  styleUrls: ['./track-transaction.component.scss']
})
export class TrackTransactionComponent implements OnInit {
  tableDataSource!:any;
  advanceAmtRecd:any=0;
  totalPaid:any=0;
  totalArrearPending:any=0;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['sr_no','date','description','credit','utrNo'];
  transactionDetails: any;
  
  
  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    
    this.apiService.transDetailsCast.subscribe((res:any)=>{
      
      this.transactionDetails=res;      
      this.tableDataSource = new MatTableDataSource<any>(this.transactionDetails);
      
     
      console.log("transactions",this.transactionDetails);
      

    this.advanceAmtRecd=this.transactionDetails.filter((x:any)=>x.type === 'CR').map((x:any)=>x.amnt).reduce((a:any, b:any) => a + b, 0);
      this.totalPaid=this.transactionDetails.filter((x:any)=>x.type === 'DR').map((x:any)=>x.amnt).reduce((a:any, b:any) => a + b, 0);
      this.totalArrearPending=this.advanceAmtRecd-this.totalPaid;
      console.log("advanceAmtRecd",this.advanceAmtRecd);
      
      
    })

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
