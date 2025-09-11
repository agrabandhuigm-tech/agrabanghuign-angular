
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ConnectableObservable } from 'rxjs';


// import { LoaderService } from 'src/app/services/loader.service';

import { ApiService } from 'src/app/services/api.service';
import { RedirectService } from 'src/app/services/redirect.service';
@Component({
  selector: 'app-esign-modal',
  templateUrl: './esign-modal.component.html',
  styleUrls: ['./esign-modal.component.scss']
})
export class EsignModalComponent implements OnInit {
  
  pdfSrc:any;
  base64Pdf:any;
  esignData:any;
  msg:any;
  isEsign:boolean=false;
  count:any=0;
  isPK:boolean=false;
  buttonText:any="OK";
  isPS:boolean=false;
  userDetails:any={"role":"",
  "roleid" :"",
 "assignmentid":""};

//public  load:LoaderService
  constructor( @Inject(MAT_DIALOG_DATA) public data: {message: any,},
  private router: Router ,public dialog: MatDialog,
  public redirectService:RedirectService, private api:ApiService
  ) {  }

  ngOnInit(): void {
    console.log(this.data);
    // alert(this.data.message.transId+" "+this.data.message.redirectUrl);
    this.getEsignData();
   
   
  }

  redirectToBack()
  {
this.router.navigate([this.data.message.redirectUrl]);
this.router.navigate(
  [this.data.message.redirectUrl],
  { queryParams: {} }
);
if(this.count==0)
{
  // this.billProcess();
}

this.count=this.count+1;
    // }
this.dialog.closeAll();

  }
  
  getEsignData()
  {
    let data={
      "trxnNo":this.data.message.transId
    }
    let url="esignTransaction";

  this.api.postNewEsign(url,data).subscribe((res:any)=>
  {


    this.esignData=JSON.parse(res);
    if(this.esignData.responseStatus=='1')
    {
      this.isEsign=true;
      this.msg="E-Sign Successfully done.";
    
     
      // this.deletefile();
    }else
    {
      this.isEsign=false;
      this.msg="E-Sign have Error.";
    }
    
    console.log("esignData", this.esignData);
    // this.deletefile();
  })
  }
  
  // deletefile()
  // {
  //   let url="deleteFile";
  //   let data={
  //     "fileName":this.esignData.docName
  //   }
  //   console.log("delete file",data)
  //   this.api.postNewEsign(url,data).subscribe((res:any)=>
  // {
  //   console.log("delete file res", res);
  // })
  // }
  getBaseData()
{

  this.count=this.count+1;
  let data={
    "type": "Sanction",
    "sourceId": 2,
    "docs": [
      {
        "docId": this.esignData.docId,
        "dRevisionID": 1,
        "docName":  this.esignData.docName
      }
    ]
  }
  let url="getpdffiles";

this.api.postNewEsign(url,data).subscribe((res:any)=>
{

  res=JSON.parse(res)
  console.log("res",res.data.document[0].content);
  this.base64Pdf=res.data.document[0].content;
  if(this.base64Pdf)
  {const byteArray = new Uint8Array(
    atob(this.base64Pdf)
      .split("")
      .map(char => char.charCodeAt(0))
  );
  this.pdfSrc = "";
  const file = new Blob([byteArray], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(file);
  this.pdfSrc = fileURL;
  const pdfWindow = window.open("");
  pdfWindow!.document.write("<iframe width='100%' height='100%' src='" + fileURL + "'></iframe>");

  }else{
    alert("Sorry, an error has occurred. Please try again later")
  }
})
}

// esignRequest()
//  {
// let resData:any=this.config.getDetails("pkEsignData");
// resData=JSON.parse(resData);
//    console.log("data",resData);

//   let data = {
//     "reportPath": resData.reportPath,
//     "name": resData.name,
//     "value": resData.value,
//     "url": resData.mainurl,
//     "contextPath": "",
//     "xCoordinate": 400,
//     "yCoordinate": 35,
//    "assignmentId": this.userDetails.assignmentid,
//     "docTypeId": resData.docTypeId,
//     "docName": resData.docName,
//    "roleId": "6",
//     "requestId":resData.requestId?resData.requestId:"",
//     "processId":resData.processId
//   }


//   console.log("esignXmlRequest", data);

// let url = "sendrequest";
// // this.load.show();

// //   this.api.postNewEsign(url, data).subscribe((res: any) => {
// //     console.log("res", res);
   
// //       // localStorage.setItem("esigntype","")
    
// //       this.config.storeDetails("esigntype","")
// //       this.load.hide();
// //       setTimeout(() => {
// //         this.redirectService.postRedirect(res);
// //       },300);
    

// //   })


// }
// onSubmit_Final() {
//   let data:any=this.config.getDetails("approverSubmitData");
// if(data)
// {
//   data=JSON.parse(data)
// }
// console.log("documentlist", data.payload.documents); 
// if(data.payload.documents)
// {
//   let rajIndex=0;
//   data.payload.documents.filter((data: any, index: number)=>{
//     if(data.docName == "Pension Set"){
//       rajIndex = index;
//       return data;
//     }
// })
// if(this.esignData.docId)
// {
//   data.payload.documents[rajIndex].dmsDocId=  this.esignData.docId;
//   //this.documentlist[rajIndex]['newDocName']=this.fileName;
//   console.log("documentlist", data.payload.documents); 
// }
// }
     
         
//   console.log("forward Data",data);      
         
//   this.api.requestApplication(data, 'action').subscribe({
//     next: (res) => {
//       if (res.status = 200) {
//        alert("Forward Successful");
//        this.dialog.closeAll();
//         this.router.navigate([this.data.message.redirectUrl]);
//         this.router.navigate(
//           [this.data.message.redirectUrl],
//           { queryParams: {} }
//         );
//       }
//     },
//     error: (err) => {
//     },
//   });
// }
}
