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
    { img: './assets/images/slide10.jpg', title: 'वर्ष 2025 शोभा यात्रा में ** महाराजा अग्रसेन रथ पर सुशोभित होने वाले सम्मानीय श्रीमान सुनील गोयल साहब एवं श्रीमती राजकुमारी गोयल' }
  ];
    events = [
    { img: './assets/images/event1.jpg', title: 'Agrasen Jayanti(22 Sep. 2025)' },
    { img: './assets/images/slide2.jpg', title: 'Other' }
  ];
  Committee= [
    { img: './assets/images/c11.jpg', name: 'अरविन्द कुमार अग्रवाल' ,post:"अध्यक्ष अग्रबंधु कल्याण समिति इंदिरा गांधी नगर जयपुर"},
    { img: './assets/images/c2.jpg', name: 'महेश चंद गुप्ता',post:"सचिव अग्रबंधु कल्याण समिति इंदिरा गांधी नगर जयपुर" },
      { img: './assets/images/c33.jpg', name: 'कपिल टिक्कीवाल',post:"कोषाध्यक्ष अग्रबंधु कल्याण समिति इंदिरा गांधी नगर जयपुर" }
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
    // this.router.navigateByUrl('preview')
  }
}
