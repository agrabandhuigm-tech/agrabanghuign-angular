import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.scss']
})
export class MydashboardComponent {
  slides = [
    { img: './assets/images/slide1.jpg', title: 'Welcome to Agarwal Samaj' },
    { img: './assets/images/slide2.jpg', title: 'Community Events' }
  ];
    events = [
    { img: './assets/images/event1.jpg', title: 'Agrasen Jayanti(22 Sep. 2025)' },
    { img: './assets/images/slide2.jpg', title: 'Other' }
  ];
constructor(private router:Router){}
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: true,
     animateIn: 'fadeIn',  
  animateOut: 'fadeOut',  
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  };
  onRouting(url:string)
  {
    this.router.navigateByUrl(url)
  }
  ImagePreview(url:any)
  {
    this.router.navigateByUrl('preview')
  }
}
