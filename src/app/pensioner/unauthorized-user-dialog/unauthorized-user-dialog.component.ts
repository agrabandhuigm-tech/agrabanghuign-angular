import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-unauthorized-user-dialog',
  templateUrl: './unauthorized-user-dialog.component.html',
  styleUrls: ['./unauthorized-user-dialog.component.scss']
})
export class UnauthorizedUserDialogComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: {message: string}, private router: Router ,public dialog: MatDialog,) { }

  ngOnInit(): void {
  }
  onSubmit(){

  }

  redirectToDashboard(){
    location.href = "http://ifmstest.rajasthan.gov.in/ifmssso/#/module-info";
    this.dialog.closeAll();
  }
}
