import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { RedirectService } from 'src/app/services/redirect.service';
import { LoaderService } from 'src/app/services/loader.service';

import { ApiUrlService } from 'src/app/services/api-url.service';



@Component({
  selector: 'app-common-dialogue-box',
  templateUrl: './common-dialogue-box.component.html',
  styleUrls: ['./common-dialogue-box.component.scss'],
  standalone: false
})

export class CommonDialogueBoxComponent implements OnInit {


  // isVisible:Boolean=false;
  constructor(
    private router: Router, @Inject(MAT_DIALOG_DATA)
    public data: { getEventStatus: any, res: any, index: any, otpData: any, mobileNo: any, Actiontype: any, resData: any },
    private dialogRef: MatDialogRef<CommonDialogueBoxComponent>,
    public dialog: MatDialog,
    public apiService: ApiService,
    public api: ApiService,
    private formbuilder: FormBuilder,
    private modalService: NgbModal,
    private routers: Router, private http: HttpClient,
    private redirectService: RedirectService,
    public load: LoaderService,
    public apiurl: ApiUrlService,
    private _snackBar: MatSnackBar,

  ) {


  }



  ngOnInit(): void {


  }









}











