import { Component } from '@angular/core';
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

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 1000,
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
}
