import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent implements OnInit {
  public _dataSource = new MatTableDataSource([]);
  public displayedColumns: string[] | undefined;
  @Input() columns: any;
  constructor() { }

  ngOnInit(): void {
  }

}
