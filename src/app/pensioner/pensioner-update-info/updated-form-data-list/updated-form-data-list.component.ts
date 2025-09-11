import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updated-form-data-list',
  templateUrl: './updated-form-data-list.component.html',
  styleUrls: ['./updated-form-data-list.component.scss']
})
export class UpdatedFormDataListComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  bankdataSource: MatTableDataSource<any> = new MatTableDataSource();
  currentaddressSource: MatTableDataSource<any> = new MatTableDataSource();
  permanentaddressSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) Sort!: MatSort;

  // displayedColumns: string[] = ['deptId', 'docId', 'grievanceId', 'officeId', 'pensionerId', 'requestId' , 'Action'];

  // displayedColumns: string[] = ['srNo', 'pensionerId', 'bankTreasuryDetails', 'ifscCode', 'bankName' , 'mobileNumber', 'panNo', 
  //    'currentAddress',  ];

  // displayedColumns: string[] = ['srNo',  'bankTreasuryDetails', 'ifscCode', 'bankName' , 
  // 'currentAddress',  ];

     displayedColumns: string[] = [ 'pensionerId',  'mobileNumber', 'panNo',   ];

     displayedColumns1: string[] = [   'currentAddress',   ];

     displayedColumns2: string[] = [   'permanentAddress',    ];

     displayedColumns3: string[] = [ 'bankTreasuryDetails', 'ifscCode', 'bankName' , ];


    config:AppConfig=new AppConfig()
    pensionerData:any;

    initialApiData:any[] = [];
    parseData:any[] = [];
    initialApiKeydata:any;


  constructor(private apiService: ApiService, private router: Router,) {



   }

  ngOnInit(): void {

    this.apiService.configMenu = { IsShow: true };
    let details = sessionStorage.getItem('userDetails');
    let ifmsToken = sessionStorage.getItem('profileDetails');
    console.log(details);
    console.log(ifmsToken);
    
    if(details)
      {
        let data=JSON.parse(this.config.decrypt(details))
        // let data1=JSON.parse(this.config.decrypt(ifmsToken))
        // console.log("pensionerData",data1);
        this.pensionerData=data[0]
      }
    console.log("pensionerData",this.pensionerData);


    this.initialApi();

 

  }



 initialApi(){

  let obj = {

      // "pensionerId": 1647708,
      // "pensionerId":  this.pensionerData?.pensionerId,
      "pensionerId":  this.pensionerData?.pensionerId ? this.pensionerData?.pensionerId : '',
      // "pensionerId":  '',
      // "pensionerId":  50000,
      "inType": 2

  }

  this.apiService.postpension('submitPsnCommonRequest', obj).subscribe({
    // this.apiService.postpension('submitPsnCommonRequest', finalObject).subscribe({
     next: (res) => {

     console.log(res);
     console.log(res.data)

    //  this.initialApiKeydata = res.data[0].pensionerId;
    //  console.log(this.initialApiKeydata)

   

    //       let array:any[] = [];

    //         res.data.forEach((option:any ) =>{

    //   let parsedRequestDetails = JSON.parse(option.requestDetails)

    //   array.push(parsedRequestDetails);
      
    // }
    //        );

    //     console.log(array)


    //     this.dataSource.data = array
    //     console.log(this.dataSource)
    //     console.log(this.dataSource.data)
    
    if((res.data.length >0)&& res.data[0]?.pensionerId){

      if(res.data[0]?.personalDetails && Object.keys(res.data[0]?.personalDetails).length > 0){

        this.dataSource.data = res.data
      }
      
      
       
       if(res.data[0]?.bankTreasuryDetails && Object.keys(res.data[0]?.bankTreasuryDetails).length > 0){
        this.bankdataSource.data = [res.data[0].bankTreasuryDetails]
       }
  
       if(res.data[0]?.currentAddress && Object.keys(res.data[0]?.currentAddress).length > 0){
        this.currentaddressSource.data = [res.data[0].currentAddress]
       }
      
    
       if(res.data[0]?.permanentAddress && Object.keys(res.data[0]?.permanentAddress).length > 0){
        this.permanentaddressSource.data = [res.data[0].permanentAddress]

       }
      
      console.log(this.dataSource)
      console.log(this.dataSource.data)

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.Sort;

    }else{
      this.router.navigate(['pensionerUpdatedInfo/pensionerUpdatedInfoForm'])
    }


 
         }

        })



 }

 redirectToForm(){

  this.router.navigate(['pensionerUpdatedInfo/pensionerUpdatedInfoForm'])

 }


}
