import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'styleguide';
  config: AppConfig = new AppConfig();

  constructor(public router:Router,private actRoute: ActivatedRoute,public dialog: MatDialog, private authService: AuthService){}

  ngOnInit(): void {
    //let ssoId = 'OM5108.DOIT';
    //this.router.navigate(['http://localhost:4200/#/MyDashboard?id='+this.config.encrypt(ssoId)],);  
  }


}
