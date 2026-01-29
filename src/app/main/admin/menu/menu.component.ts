import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})

export class MenuComponent implements OnInit {


  constructor(
    private route: Router,
  ) {

  }

  ngOnInit(): void {

  }


}



