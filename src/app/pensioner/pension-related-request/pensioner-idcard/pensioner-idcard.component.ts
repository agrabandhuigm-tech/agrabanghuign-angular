import {Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { ApiUrlService } from 'src/app/services/api-url.service';

@Component({
  selector: 'app-pensioner-idcard',
  templateUrl: './pensioner-idcard.component.html',
  styleUrls: ['./pensioner-idcard.component.scss']
})
export class PensionerIdcardComponent implements  OnInit{

  @ViewChild('htmlData') 
  jointImageUrl: any = "assets/images/jointImg.jfif";
  imageUrl: any = "assets/images/jointImg.jfif";
  config = new AppConfig();
  public qrData: any = '';
  public qrCode: any = '';
  public qrCodeDownloadLink: SafeUrl;
  pensionerDetails: Array<any> = [];
  userdetails:any;
  formattedAddress: any;


  constructor(private sanitizer: DomSanitizer, private router: Router, private apiService: ApiService,public apiurl: ApiUrlService) {
  }

  ngOnInit(): void {

    let details = localStorage.getItem('profileDetails');
    let decDetails = this.config.decrypt(details);
    this.pensionerDetails =  JSON.parse(decDetails);
    console.log("Data Pensioner >>>>>>>>",this.pensionerDetails) 
    if(this.pensionerDetails && this.pensionerDetails.length> 0){
      this.showPic(this.pensionerDetails[0].employeePhotoGraph)
      //this.jointPic(this.pensionerDetails[0].jointPhotoGraph);
      let a = JSON.stringify(this.pensionerDetails[0]);
      let purl:string=window.location.origin;
      let url = purl+'/#/validate-pensioner-idcard?id=';
      this.qrCode= url + this.pensionerDetails[0].ssoId ;
    }

     // Process the address
    // this.formatAddress(this.pensionerDetails[0].permanentAddress);
    
  }




  formatAddress(address: any): void {
    const components = address.split(',');
    
    if (components.length === 5) {
      const formatted = `${components[0].trim()}, ${components[1].trim()}, ${components[3].trim()}, ${components[4].trim()} , ${components[2].trim()}`;
      this.formattedAddress = formatted;
      console.log(this.formatAddress);
    } else {
      // Handle cases where the address format is different
      this.formattedAddress = address;
      // console.log(this.formatAddress);

    }
  }



  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    // Set the desired width and height for the smart card
  let smartCardWidth = 85.6; // in mm
  let smartCardHeight = 53.98; // in mm

  const fontSize = 20;

  // Get the HTML element
  const htmlDataElement: HTMLElement | null = document.getElementById('htmlData');

  if (htmlDataElement) {
    // Increase the font size of the content inside the element
    htmlDataElement.style.fontSize = `${fontSize}px`;


  html2canvas(DATA,{ backgroundColor: '#ffffff' }).then((canvas) => {

     // Reset the font size to its original value
    //  htmlDataElement.style.fontSize = '';
     htmlDataElement.style.backgroundColor = '#ffffff'; 
    // Create a new PDF instance
    let PDF = new jsPDF('p', 'mm', 'a4');
   

    // Add the captured image to the PDF with custom dimensions
    PDF.addImage(canvas.toDataURL('image/png'), 'PNG', 60, 30, smartCardWidth, smartCardHeight);

    // Save the PDF with a specified name
    PDF.save('PensionIdentityCard.pdf');
  }); 
  }
}


  onChangeURL(url: any): void {
    this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = this.qrCodeDownloadLink.toString();
    link.setAttribute('visibility','hidden');
    link.click();
  }


  showPic = (id:any) =>{
    let data = {
      
      "type": "pension",
      "sourceId": 2,
      "docs": [
        {
          "docId":id
        }
      ]
    }
    //console.log("single report data", data)
    this.apiService.postOr("wcc/getfiles", data).subscribe((res: any) => {
      // Ensure res and its properties exist before accessing them
      if (res && res.data && res.data.document && res.data.document[0] && res.data.document[0].content) {
        // Proceed with setting the imageUrl if content exists
        this.imageUrl = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(res.data.document[0].content) as any).changingThisBreaksApplicationSecurity;
      } else {
        // Handle the case when content is not available
        console.error("Document content is not available");
      }
    }, error => {
      // Handle the error case
      console.error("Error occurred while fetching files:", error);
    });
  }

}
