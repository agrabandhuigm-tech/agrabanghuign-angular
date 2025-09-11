import {AfterViewInit, Component, OnInit,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { VenderData } from 'src/app/model/testdata';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';

/** Constants used to fill up our data base. */


@Component({
  selector: 'app-search-payee',
  templateUrl: './search-payee.component.html',
  styleUrls: ['./search-payee.component.scss']
})
export class SearchPayeeComponent implements OnInit {
  searchkey:any;
  role:any;
  panelOpenState = false;
  displayedColumns: string[] =["NAME","MOBILE_NO","EMAIL_ID","ACCOUNT_No","pan","Payee-ID"]
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  searchData:any[]=[];
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};
  config: AppConfig = new AppConfig();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public router:Router,
    private dialog: MatDialog,
    private actRoute: ActivatedRoute,
    public api:ApiService, 
    public apiurl:ApiUrlService) {
      this.userDetails=this.config.getUserDetails();
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
   
    // Assign the data to the data source for the table to render
    
  }
  ngOnInit(): void {
    this.role = this.userDetails.role;
    let jwttoken  = localStorage.getItem('jwt_token');
    const decrypttoken: any =  this.config.decrypt(jwttoken)
    this.addSearchData();
  }


addSearchData()
{  let url = '/vendor';
let data = '';
  this.api.post(url,data).subscribe((res: any) => {
      
    console.log("result",res);
    if(res.status=='SUCCESS')
    {
      console.log(res);
      

      let users:any= res.data;
      this.dataSource = new MatTableDataSource(users);
      
  //  console.log("data length",s.length);
   if(res.data)
   {
    this.searchData=res.data;
    console.log("this.searchData",this.searchData);
    
   this.dataSource = new MatTableDataSource(this.searchData);
   }
    }
  })

}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openPayeeRegistration(data:any)
  {
      console.log("data",data);
      const enData: any =  this.config.encrypt(JSON.stringify(data));
      console.log("enData",enData);
      this.router.navigate(
        ['registration'],
        { queryParams: { edit: 'edit',data:enData } }
      );
     
      
      this.dialog.closeAll();
   
   
  }
  searchVendor()
  {
    var url=this.apiurl.url.payeesearch;
    var data={
      "inSearchData": this.searchkey,
       "inSearchType": ""
    }
    // this.load.show();
    this.api.postpayee(url,data).subscribe((res: any) => {
      
      console.log("result",res);
      if(res.status=='SUCCESS')
      {
        
    //  console.log("data length",s.length);
     if(res.data)
     {
      this.searchData=res.data;
      console.log("this.searchData",this.searchData);
      
     this.dataSource = new MatTableDataSource(this.searchData);
     }
      }
    })
  }
  openViewVendor(data:any)
  {
    console.log("data",data);
    const enData: any =  this.config.encrypt(JSON.stringify(data));
    console.log("enData",enData);
    this.router.navigate(
      ['view-payee'],
      { queryParams: { data: enData } }
    );
    this.dialog.closeAll();
  }
}




