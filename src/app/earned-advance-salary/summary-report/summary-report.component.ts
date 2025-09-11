import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['date', 'emp_id', 'emp_name', 'department', 'mobile_no'];
  displayedColumns1: string[] = ['emp_id', 'emp_name', 'post', 'ddo_code', 'office_name', 'department', 'wth_amt', 'wth_date', 'utr_no', 'last_month_sal', 'retirement_date'];

  transactionDataCount: any;
  showTransTable: boolean = false;
  consentEmployeeList: boolean = false;
  kycVerifiedEmployeeList: boolean = false;
  txnPerformedEmployeeList: boolean = false;
  txnDetailList: boolean = false;
  txnAmountDetailList: boolean = false;
  employeeTableDataSource: MatTableDataSource<any>; // Initialize as MatTableDataSource
  currentSelection: any;

  constructor(private _liveAnnouncer: LiveAnnouncer, private apiService: ApiService,private load:LoaderService) { }

  ngOnInit(): void {
    this.employeeTableDataSource = new MatTableDataSource<any>(); // Initialize the MatTableDataSource instance

    this.apiService.configMenu = { IsShow: true };
    this.apiService.pension({},'getAdminDashboardData').subscribe({
      next: (res:any) => {
        if (res.data) {
          this.transactionDataCount = res.data;
          console.log('transactionDataCount', this.transactionDataCount);
        }
      },
    });
  }

  ngAfterViewInit() {
    this.employeeTableDataSource.paginator = this.paginator;
    this.employeeTableDataSource.sort = this.sort;
  }

  getDataBySelection(selection: any) {
    this.currentSelection = selection;
    this.showTransTable = false;
    this.txnAmountDetailList = false;
    let endpoint: string = '';
    let payload: any;
let flag:any;
    switch (selection) {
      case 'ConsentEmployeeList':
        this.showTransTable = true;
        endpoint = 'getConsentEmployeeList';
        flag=1;
        break;
      case 'KycVerifiedEmployeeList':
        this.showTransTable = true;
        endpoint = 'earnedAdvSal/getKycVerifiedEmployeeList';
        flag=2;
        break;
      case 'TxnPerformedEmployeeList':
        this.showTransTable = true;
        endpoint = 'earnedAdvSal/getTxnPerformedEmployeeList';
        flag=3;
        break;
      case 'TxnDetailList':
        this.showTransTable = true;
        endpoint = 'earnedAdvSal/getTxnDetailList';
        flag=4;
        break;
      case 'getTxnAmountDetailList':
        this.txnAmountDetailList = true;
        endpoint = 'earnedAdvSal/getTxnAmountDetailList';
        flag=5;
        break;
      default:
        break;
    }
payload['flag']=flag;
    if (flag>0) {
      this.load.show();
      this.apiService.pension(payload,'getConsentEmployeeList').subscribe({
        next: (res:any) => {
          this.load.hide();
          if (res.data) {
            const k = Object.keys(res.data);
            this.employeeTableDataSource.data = res.data[k[0]]; // Assign the data to the MatTableDataSource

            this.employeeTableDataSource.paginator = this.paginator;
            this.employeeTableDataSource.sort = this.sort;
          }
        }
      });
    }
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
