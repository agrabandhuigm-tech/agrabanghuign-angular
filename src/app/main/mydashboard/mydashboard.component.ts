import { Component, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { log } from 'console';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { PdfpreviewComponent } from '../pdfpreview/pdfpreview.component';
import { CommonDialogueBoxComponent } from '../common-dialogue-box/common-dialogue-box.component';



@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.scss']
})

export class MydashboardComponent implements OnInit, AfterViewInit, OnChanges {



  constructor() {




  }

  ngOnInit(): void {



  }
  ngOnChanges(changes: SimpleChanges): void { }

  ngAfterViewInit(): void {

  }
  slides = [
    { img: "assets/images/slide1.jpg", title: "Annual Function" },
    { img: "assets/images/slide2.jpg", title: "Medical Camp" },
    { img: "assets/images/slide3.jpg", title: "Cultural Program" }
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    dots: true,
    arrows: true,
    infinite: true
  };
}





