import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import domToImage from 'dom-to-image';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-pensioner-pay-slip',
  templateUrl: './pensioner-pay-slip.component.html',
  styleUrls: ['./pensioner-pay-slip.component.scss']
})
export class PensionerPaySlipComponent implements OnInit {

pensionSlipData: any ={};
yearList: any[] = [];
monthList:any[] = [];
reportYear: any = '';
reportMonth: any = '';
monthYearList: any[]=[];
userdetails: any = {};
isError: boolean = false;
config : AppConfig = new AppConfig();
Object: any = Object;

@ViewChild('MonthlyPensionSlipToExport', {static: false}) public MonthlyPensionSlipToExport : ElementRef; 

getSsoId:any;
profileDetails : any;



  constructor(private apiEssService: ApiEssService,private apiService: ApiService,public commonService:CommonService,private load:LoaderService,private sanitizer: DomSanitizer,) {
    this.userdetails= this.config.getUserDetails();
    console.log(this.userdetails)
    // this.userdetails[0].ppoNo;
   }

  ngOnInit() {


    if(localStorage.getItem("profileDetails")){
      let details =localStorage.getItem("profileDetails");
          let decDetails = this.config.decrypt(details);
          this.getSsoId =  JSON.parse(decDetails);
          this.profileDetails= this.getSsoId[0];    
          console.log('profileDetails>>>>>>>>>>>>>>>>>>>>>>',this.profileDetails)
          //  this.commonService.personalProfileDetails.next(details)      
      
     }


    this.getMonthYear();
  }
  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber) {
      return ''; // Handle cases where account number might be null or undefined
    }

    const maskedPart = '*'.repeat(accountNumber.length - 2); // Generate the masked part with asterisks
    const visiblePart = accountNumber.slice(-2); // Extract the last 2 digits

    return `${maskedPart}${visiblePart}`; // Concatenate and return masked account number
  }

  getMonthYear(){
    this.apiEssService.empServicese('getYearMonth',{}).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.status == 'SUCCESS' && res?.data && res?.data.length > 0){
            this.monthYearList = res.data;
            console.log(this.monthYearList)
            this.createYearList();

            // this.yearList = this.monthYearList.reduce((accm: any , current: any)=>{
            //     const exists = accm.find((item: any) => item.psnYear == current.psnYear);
            //     if(!exists){
            //       let data = {psnYear: current.psnYear};
            //       accm.push(data)
            //     }
            //     return accm;
            //   }, [])

            //   this.yearList.sort((a:any, b:any) => a.psnYear - b.psnYear);
          // console.log(this.reportYear);
          

          ////////////////////////////////////////////////////////////////////


          // const currentYear = new Date().getFullYear();
    
          // this.yearList = this.monthYearList.filter(item => parseInt(item.psnYear, 10) <= currentYear);
          
          // console.log(this.yearList);



          //////////////////////////////////////////////////


        }
      },
      error:(err:any)=>{

      },
      complete: ()=>{
        
      }
    })

  }

  createYearList() {
    // debugger;
    // Extract unique years
    this.yearList = this.monthYearList.reduce((accm: any[], current: any) => {
      const exists = accm.find(item => item.psnYear === current.psnYear);
      if (!exists) {
        accm.push({ psnYear: current.psnYear });
      }
      return accm;
    }, []);

    // Sort yearList by year
    this.yearList.sort((a: any, b: any) => parseInt(a.psnYear, 10) - parseInt(b.psnYear, 10));

    // Get the current year and previous year
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Filter to include only the current year and previous year
    this.yearList = this.yearList.filter(item => parseInt(item.psnYear, 10) === currentYear || parseInt(item.psnYear, 10) === previousYear);

    console.log(this.yearList);
  }


  getMonthFromYear(){
    this.monthList = this.monthYearList.filter((item:any) => item.psnYear == this.reportYear);
    console.log(this.monthList)
    this.monthList.sort((a:any, b:any) => a.psnMonthNumber - b.psnMonthNumber);
  }


  getPensionSlipDetails(){
    // initialize payslip data
    this.pensionSlipData = {};
   


    let request = {
      "reportPath": "/Pension/Pension_Slip/Report/Pension_slip.xdo",
      "format": "pdf",
      "params": [
        {
         "name": "in_type",
         "value": '1'
       },
       {
         "name": "bill_month",
         "value": this.reportMonth
       },
       {
         "name": "bill_year",
         "value": this.reportYear
       },
       {
         "name": "ppono",
         "value": (this.profileDetails.ppoNo.toString()).length === 10? this.profileDetails.ppoNo.slice(3)  :this.profileDetails.ppoNo
       },
       {
         "name": "accno",
         "value": this.profileDetails.accNo.slice(-4)
       }
      ]
    }

    this.apiService.postOr("report/singlereport", request).subscribe((res: any) => {
      console.log("res", res.data.report.content);
      this.load.hide();
      if(res.data.report.content)
      {
        this.base64data ='data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(res.data.report.content) as any).changingThisBreaksApplicationSecurity;
        if (top?.document.getElementById('ifrm')) {
          top.document.getElementById('ifrm')?.setAttribute('src', this.base64data);
        }
      }else
      {
        alert("Report have error.")
      }
     
     


      this.load.hide();

    


    }, (error) => {
      this.load.hide();
      alert("Some error occured");
    })
  }
  base64data:any
  openMonthlyPensionPDF(): void{
    const width = this.MonthlyPensionSlipToExport.nativeElement.clientWidth;
    const height = this.MonthlyPensionSlipToExport.nativeElement.clientHeight + 40;

    let orientation: any = '';
    let imageUnit: any = 'pt';

    if(width > height){
      orientation = 'l';
    }else{
      orientation = 'p';
    }

    domToImage.toPng(this.MonthlyPensionSlipToExport.nativeElement, {
      width: width,
      height: height
    })
    .then(result =>{
      let jsPdfOptions = {
        orientation : orientation,
        unit: imageUnit,
        format: [width+50, height + 220]
      }; 
      const pdf = new jsPDF(jsPdfOptions);
      let pdfName = `MonthwisePension_Slip${Math.random()}.pdf`;

      pdf.setFontSize(12.5);
      pdf.setTextColor('#2585fe');
      // pdf.text('Report date: ' + moment().format('ll'), 25, 115);
      pdf.addImage(result, 'PNG', 50,50, width, height);
      pdf.save(pdfName);
    }).catch(error =>{
      if(error)
      alert('Unable to download pdf');
    })
  }

}
