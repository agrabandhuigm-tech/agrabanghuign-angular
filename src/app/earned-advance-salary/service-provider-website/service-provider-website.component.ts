import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-provider-website',
  templateUrl: './service-provider-website.component.html',
  styleUrls: ['./service-provider-website.component.scss']
})
export class ServiceProviderWebsiteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    
    
  }


  redirectToServiceProvider(){
    setTimeout(() => {
      location.href = `${location.origin}/#/pss/service-provider-website-success-component?transId=123456&referenceId=67890`;
    }, 3000);
  }

}
