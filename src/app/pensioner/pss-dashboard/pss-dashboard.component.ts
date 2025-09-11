import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { PdfpreviewComponent } from '../pdfpreview/pdfpreview.component';

@Component({
  selector: 'app-pss-dashboard',
  templateUrl: './pss-dashboard.component.html',
  styleUrls: ['./pss-dashboard.component.scss']
})
export class PssDashboardComponent implements OnInit {

  pensionerInfoResult: any;
  userDetails: any = {};
  config: AppConfig = new AppConfig();
  isVisible:boolean=false;

  constructor(public apiService: ApiService,public api:ApiService,public apiurl: ApiUrlService,private actRoute: ActivatedRoute,public dialog:MatDialog) {
    
   }

  ngOnInit(): void {
    
    this.actRoute.queryParams.subscribe((params: any)=>{
      console.log("ram",params['id']);
  
      if(params && params['id']){
        sessionStorage.setItem("jwt_token", params['id'])
        this.userDetails.ssoId = this.config.decrypt(params['id']);       
        
      }
      else
      {
       
      }
    })
    this.getUserInfo(); 
   
  }


  getUserInfo()
  {
    
        var url = this.apiurl.url.pensionerInfo;
        let details = localStorage.getItem('userDetails');
        let decDetails = this.config.decrypt(details);
        this.userDetails =  JSON.parse(decDetails);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>',this.userDetails)
        var data = {
          "ssoId": this.userDetails.ssoId
        };
        this.api.postpension(url, data).subscribe((res: any) => {
          console.log("result>>>", res);
          if (res.status == 'SUCCESS') {
            let data: any[] = res.data;
            console.log(res.data)
            this.pensionerInfoResult=res.data
            // let encData: any = this.config.encrypt(JSON.stringify(res.data[0]));
            // localStorage.setItem('userDetails', encData);
            // let details = localStorage.getItem('userDetails');
            // let decDetails = this.config.decrypt(details);
            // this.userDetails =  JSON.parse(decDetails);  
            // console.log("upt>>>>>>>>>", this.userDetails)   
            console.log(this.pensionerInfoResult)
          }
        })  
    }

    updateUserDetails(item:any){
      console.log('item data>>',item)
      console.log('pensioner id>>',item.pensionerId)
      let encData: any = this.config.encrypt(JSON.stringify(item));
      localStorage.setItem('userDetails', encData);
      let details = localStorage.getItem('userDetails');
      let decDetails = this.config.decrypt(details);
      this.userDetails =  JSON.parse(decDetails);      
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>neha',this.userDetails)
      // this.ppoNo=item["ppoNo"];
      // this.dateOfRet=item["dor"];
      // this.name =item["nameEn"];

      //window.location.reload();  
    }

    previewFiles(){
        //alert("Response Data Is Blank that's why here don't get Doc ID .")
     // console.log(item);
      console.log(this.pensionerInfoResult[0].pensionKitId)
      let dmsDocId=this.pensionerInfoResult[0].pensionKitId;
      if(dmsDocId =this.pensionerInfoResult[0].pensionKitId)
      {
      let data={
        "type": "pension",
        "sourceId": 2,
        "docs": [
          {
            "docId": this.pensionerInfoResult[0].pensionKitId
          }
        ]
      }
      console.log("single report data",data)
      this.api.postIntegration("wcc/getfiles",data).subscribe((res:any)=>{
        console.log("res",res.data.document[0].content);
        if(res.data.document[0].content)        
        {
          let data={
            "base64Pdf":res.data.document[0].content,
            "redirectUrl":"pensioner/pssdashboard"
            }
               console.log("data",data);  
           this.dialog.open(PdfpreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});           
        }
      })
    }else
    {
      alert("Preview Not Available")
    }
    }
}
