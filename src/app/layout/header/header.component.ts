import { Component, HostListener, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import * as menu1 from '../../translations/menu.json';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CommonDialogueBoxComponent } from 'src/app/main/common-dialogue-box/common-dialogue-box.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {



  constructor(
  ) {

  }

  ngOnInit(): void {

  }






}







