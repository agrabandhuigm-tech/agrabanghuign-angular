import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import domToImage from 'dom-to-image';
import { ApiEssService } from 'src/app/services/api-ess.service';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
@Component({
  selector: 'app-pensioner-financial-year-status',
  templateUrl: './pensioner-financial-year-status.component.html',
  styleUrls: ['./pensioner-financial-year-status.component.scss']
})
export class PensionerFinancialYearStatusComponent implements OnInit {
yearList: any[] = [];
reportYear: any = '';
reportMonth: any = '';
monthYearList: any[]=[];
userdetails: any = {};
Object: any = Object;
config : AppConfig = new AppConfig();
yearlyPensionData: any = [];
financialYearTotal: any = {};
isError: boolean = false;
@ViewChild('YearlyPensionSlipToExport', {static: false}) public YearlyPensionSlipToExport : ElementRef; 
  constructor(private apiEssService: ApiEssService,private apiService: ApiService,) {
    this.userdetails= this.config.getUserDetails();
    console.log(this.userdetails)
    // this.userdetails[0].ppoNo;
   }

  ngOnInit() {
    this.getMonthYear();
    
  }

  getMonthYear()
  {
    this.apiEssService.empServicese('getYearMonth',{}).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.status == 'SUCCESS' && res?.data && res?.data.length > 0){
            this.monthYearList = res.data;
            console.log(this.monthYearList)
            this.yearList = this.monthYearList.reduce((accm: any , current: any)=>{
                const exists = accm.find((item: any) => item.psnYear == current.psnYear);
                if(!exists){
                  let data = {psnYear: current.psnYear};
                  accm.push(data)
                }
                return accm;
              }, [])
          console.log(this.reportYear);
          this.yearList.sort((a:any, b:any) => a.psnYear - b.psnYear);
        }
      },
      error:(err:any)=>{

      },
      complete: ()=>{
        
      }
    })

  }

  getCompleteFinancialYearDetails(){
    // initialize report data
    this.yearlyPensionData = [];
    // initialize total amount

    let total: any = {penAmt: 0,commutAmt: 0,RedAmt: 0,drPen: 0,ir: 0,adlPen:0,adlAlw: 0,medAlw:0,dhaAlw:0,otheAlw: 0,arrearAmt: 0,itTax:0, recovery:0,
      grossAmt:0,deduction:0,netAmt:0};

    // this.apiService.pension({"inType":2,"billMonth":0,"billYear":this.reportYear,ppoNo: '1193410'},'getBillDetailsByMonthAndYear').subscribe({
    //   next: (res:any) => {
    //    console.log("res",res);
    //    if(res?.data && res?.data.length > 0 && res.data[0].message !== 'No Record Found')
    //    {
    //       this.yearlyPensionData =  res?.data;
    //       console.log(this.yearlyPensionData)
    //       let billdate = this.yearlyPensionData[0]['billDate'];
    //       let date = billdate.split('-');
    //       console.log(date);

    //       this.yearlyPensionData.map((data: any)=>{
    //         let monthName: any;
    //         if(date.length > 0){
    //             monthName = date[1];
    //         }
    //         console.log(date)
    //         console.log(monthName)
    //         data['billToYear'] = parseInt(data['billYear']) + 1;
    //         data['billMonthName'] =  monthName;
    //         return data;
    //       })

    //       // Calculated total amount
    //         let totalKeys = Object.keys(total);
    //         this.financialYearTotal = this.yearlyPensionData.reduce((accm: any , current: any)=>{
    //           totalKeys.forEach((data: any) =>{
    //             total[data] = parseInt(total[data]) + parseInt(current[data]);
    //           })
    //         return total;
    //       },{});
    //       console.log(this.financialYearTotal)
    //    }else{
    //     this.isError = true;
    //    }
    //   },error: (err: any)=>{
    //     this.isError = true;
    //   }
    // })
  }

  openFinancialYearPDF(): void{
    const width = this.YearlyPensionSlipToExport.nativeElement.clientWidth;
    const height = this.YearlyPensionSlipToExport.nativeElement.clientHeight + 40;

    let orientation: any = '';
    let imageUnit: any = 'pt';

    if(width > height){
      orientation = 'l';
    }else{
      orientation = 'p';
    }

    domToImage.toPng(this.YearlyPensionSlipToExport.nativeElement, {
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
      let pdfName = `AnnualStatement2024-2025${Math.random()}.pdf`;

      pdf.setFontSize(12.5);
      pdf.setTextColor('#2585fe');
      // pdf.text('Report date: ' + moment().format('ll'), 25, 115);
      pdf.addImage(result, 'PNG', 20,20, width-100, height-100);
      pdf.save(pdfName);
    }).catch(error =>{
      if(error)
      alert('Unable to download pdf');
    })
  }

}
