import { Component, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';


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
    { img: 'assets/images/slide1.jpg', title: 'Welcome to Agarwal Samaj' },
    { img: 'assets/images/slide2.jpg', title: 'Community Events' },
    { img: 'assets/images/slide3.jpg', title: 'Our Leaders' }
  ];
  // customOptions: OwlOptions = {
  //   loop: true,
  //   margin: 10,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: false,
  //   dots: false,
  //   navSpeed: 700,
  //   navText: ['', ''],
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     320: {
  //       items: 1.5,
  //     },
  //     400: {
  //       items: 2.7,
  //     },
  //     500: {
  //       items: 3.2,
  //     },
  //     740: {
  //       items: 3,
  //     },
  //     880: {
  //       items: 3.2,
  //     },

  //     940: {
  //       items: 4,
  //     },
  //   },
  //   nav: true,
  // };
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navText: ['‹', '›'],
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  };
}





