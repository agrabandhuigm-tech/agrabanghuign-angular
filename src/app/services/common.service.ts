import { Injectable } from '@angular/core';
import * as datahi from '../translations/translation_hi.json'
import * as dataen from '../translations/translation_en.json'
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { CommonDialogueBoxComponent } from '../pensioner/common-dialogue-box/common-dialogue-box.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiEssService } from './api-ess.service';
import { PdfPreviewComponent } from '../pensioner/pension-related-request/ess/pdf-preview/pdf-preview.component';
import { LoaderService } from './loader.service';
import { PdfpreviewComponent } from '../pensioner/pdfpreview/pdfpreview.component';
import { DashboardDialogComponent } from '../pensioner/dashboard-dialog/dashboard-dialog.component';




@Injectable({
  providedIn: 'root'
})
export class CommonService {

LanType:any="EN";
Lang:boolean=true;
personalProfileDetails:BehaviorSubject<any> =new BehaviorSubject(null)
getSsoIdToken:any;

lanJson:any;
menuItem:any;
isLocal:boolean=true;
//ppoDetails:any[] =[];
imgUrl:any;
isDev:boolean=false
  constructor(public router:Router,public apiService: ApiService, public dialog: MatDialog,public api: ApiEssService, public load: LoaderService,) {
    this.lanJson=dataen;
    console.log(this.lanJson);
    if(this.isLocal)
    {
      this.imgUrl=""
    }else
    {
      this.imgUrl="payee-manager/"
    }
    let mainUrl=window.location.origin
    if(mainUrl.includes('ifmsdev') || mainUrl.includes('ifmstest') )
    {
      this.isDev=true
    }
   }
   async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('/', { skipLocationChange: false });
    return this.router.navigateByUrl(url);
  }
  openConfirmModal(msg: any, callbackFn: any = null, callbackFnNo: any = null, config: any = null) {
    const currentDialog = this.dialog.open(DashboardDialogComponent, {
      panelClass: 'small-dialog',
      autoFocus: false,
      width: '30%',
      height: 'auto',
      data: {
        dialogText: msg,
        id: 8,
        removeCloseBtn: config?.removeCloseBtn || false
      },
    });
    currentDialog.afterClosed().subscribe((res: any) => {
      if (res === 'Y') {
        if (typeof callbackFn == 'function') {
          callbackFn();
        }
      }
      else {
        if (typeof callbackFnNo == 'function') {
          callbackFnNo();
        }
      }
    });
  }

  openSuccessModal(msg: any, callbackFn: any = null, config: any = null) {
    const currentDialog = this.dialog.open(DashboardDialogComponent, {
      panelClass: 'medium-dialog',
      autoFocus: false,
      width: '30%',
      height: 'auto',
      data: {
        dialogText: msg,
        id: 7,
        removeCloseBtn: config?.removeCloseBtn || false
      },
    });
    currentDialog.afterClosed().subscribe((res: any) => {
      if (typeof callbackFn == 'function') {
        callbackFn();
      }
    });
  }

  openErrorModal(error: any, title: any = null, callbackFn: any = null, config: any = null) {
    const currentDialog = this.dialog.open(DashboardDialogComponent, {
      panelClass: 'small-dialog',
      autoFocus: false,
      width: '30%',
      height: 'auto',
      data: {
        dialogText: error,
        id: 9,
        title: title,
        removeCloseBtn: config?.removeCloseBtn || false
      },
    });
    currentDialog.afterClosed().subscribe((res: any) => {
      if (typeof callbackFn == 'function') {
        callbackFn();
      }
    });
  }

  languageHindiChange()
  {
         this.LanType="HI";
         this.lanJson=datahi;
         console.log(this.lanJson);
         this.Lang=false;
  }
  languageEngChange()
  {
         this.LanType="EN";
         this.lanJson=dataen;
         console.log(this.lanJson);
  }
  menuClick(item:any)
  {
    this.menuItem=item;

  }
  
  reverseString(i:string)
  {
    let reverseString = "";
for (let char of i) {
   reverseString = char + reverseString;
}
return reverseString;
  }
 mask(i:string)
 {
console.log("mask number",i);
let org=this.reverseString(i)
var main=0;
 
 
if(i.length>10)
{
  main=Number(org);
  var maskNumber='';
  var r;
  for(let j=0;j<i.length;j++)
  { 
    r=main%10;
    if(j<=3)
    {
       maskNumber=maskNumber+r.toString();
    }else if(j>=(i.length)-4) 
    {
      maskNumber=maskNumber+r.toString();
    }
    else
    {
      maskNumber=maskNumber+'*';
    }
    let org1=main/10;
    main=Math.floor(org1);
    console.log(maskNumber);
  } 
}else if(i.length<10 && i.length>4)
{
  main=Number(org);
  var maskNumber='';
  for(let j=0;j<i.length;j++)
  { 
    r=main%10;
    if(j<=1)
    {
       maskNumber=maskNumber+r.toString();
    }else if(j>=(i.length)-2) 
    {
      maskNumber=maskNumber+r.toString();
    }
    else
    {
      maskNumber=maskNumber+'*';
    }
    let org1=main/10;
    main=Math.floor(org1);   
    console.log(maskNumber);    
  }
}
 }
 getJson(data:any,callbackFn: any = null) {
  this.load.show()
 
  this.apiService.postho('getEmployeeDetails', data).subscribe((res: any) => {
    this.load.hide();
    if (typeof callbackFn == 'function') {
      callbackFn(res);
    }
  }, (error) => {
    this.load.hide();
    // this.openErrorModal("Get JSON Service have error","",()=>{})
  });
}

 updateDocIdnew(data:any)
 {
      this.apiService.requestApplication2(data,'updatephotoid').subscribe((res: any) => {
      console.log("res",res)
      if(res.status =='SUCCESS' && res.data.status=="Success"){
     // if(res.data.status=="Success"){
        // return res.data.msg;
        if((res.data.msg=='Data Save Successfully')==true)
        {
          alert("Data Save Successfully")
          let data1 =res;
          data1["id"]="SUCCESS";    

          this.dialog.open(CommonDialogueBoxComponent,{data: data1,  disableClose: false});

          
        }       
        //alert(res.data.msg=='Data Save Successfully')
      }    
      });
 }

 Previewbydocid(docId:any,reportpath:any)
 {
   console.log("docid : new  " + docId);
   let data = {
     "type": 'pdf',
     "sourceId": 2,
     "docs": [
       {
         "docId": docId
       }
     ]
   }
   console.log("docid data", data)
   
   this.apiService.postOr("wcc/getfiles", data).subscribe((res: any) => {
     if(res.status !== 'F'){
       if (res.data.document[0].content) {
        
         let data = {
           "base64Pdf": "data:application/pdf;base64,"+res.data.document[0].content,
           "redirectUrl": reportpath,
           // "type":ex2[1]
         }
 
         this.dialog.open(PdfPreviewComponent, { width: '70%', data: { message: data }, disableClose: false });
         
       }
     }
     else{
       
     }
     
     
   }, err => {
    
   })
 }

 previewFilesByDocId(docId:any){

     let data={
       "type": "pension",
       "sourceId": 2,
       "docs": [
         {
           "docId": docId
         }
       ]
     }
     console.log("single report data",data)
     this.api.postIntegration("wcc/getfiles",data).subscribe((res:any)=>{
       console.log("res",res);
       if(res.data.document[0].content)  
       {
         let data={
           "base64Pdf":res.data.document[0].content,
           "redirectUrl":" "
           //"redirectUrl":"pensioner/pssdashboard"
           }      
             console.log("data",data);
         this.dialog.open(PdfpreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
         
       }
 })
 
 }
 previewSingleReport(data:any){


  console.log("single report data",data)
  this.api.postIntegration("report/singlereport", data).subscribe((res: any) => {
    console.log("res", res.data.report.content);
    this.load.hide();
  
    if (res.data.report.content) {
      let data={
        "base64Pdf":res.data.report.content,
        "redirectUrl":" "
        }      
          console.log("data",data);
      this.dialog.open(PdfpreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});
      
    }
})

}
getPensionDBData(empId:any,requestType:any,intype: number, callbackFn: any = null)
  {

    let data:any;
if(requestType=='E')
  {
    data= {
      "inType":intype,
      "requestType":requestType,
      "employeeCode":empId
  }
  }else if(requestType=='I')
    {
      data= {
        "inType":intype,
        "requestType":requestType,
        "employeeId":empId
    }
    }
  else if(requestType=='P')
    {
      data= {
        "inType":intype,
        "requestType":requestType,
        "pensionerId":empId
    }
    }
    else if(requestType=='PP')
      {
        data= {
          "inType":intype,
          "requestType":requestType,
          "ppoNo":empId
      }
      }
      console.log("Pensioner Data",data)
    this.load.show();
    this.apiService.postpension('getPensionerStatus',data).subscribe({
      next: (res) => {
        this.load.hide();
        if (typeof callbackFn == 'function') {
          callbackFn(res);
        }
      },
      error: (err) => {
        this.load.hide();
        this.openErrorModal("Pensioner Status Service have error","",()=>{})
      },
    });
  }
getAllPensionKit(i:any,value:any)
{let pkDocList:any[]=[];
  if(i==1)
  {
    this.getPensionDBData(value,'E',13,(res:any)=>{
      // console.log("pension Data13",res);
      if(JSON.stringify(res).includes("no data available"))
        {}else{
        
          if(res.data.length>0)
            {
              res.data.forEach((x:any)=>{
                if(x.dmsDocId>0 && x.docTypeId==34 )
                  {
                    pkDocList.push({dmsDocId:x.dmsDocId,createDate:x.modifiedDt==' '?x.createdDt:x.modifiedDt,pensionerId:x.pensionerId,docName:"Pension Kit"})
                  }
                  if(x.dmsDocId>0 && x.docTypeId==35 )
                    {
                      pkDocList.push({dmsDocId:x.dmsDocId,createDate:x.modifiedDt==' '?x.createdDt:x.modifiedDt,pensionerId:x.pensionerId,docName:"Pension Set"})
                    }
              })
          
              this.getPensionDBData(value,'E',14,(res:any)=>{
                // console.log("pension Data14",res);
                if(JSON.stringify(res).includes("no data available"))
                  {}else{
                   
                    if(res.data.length>0)
                      {
                        res.data.forEach((x:any)=>{
                         
                          if(JSON.stringify(pkDocList).includes(x.dmsDocId))
                          {}else if(x.dmsDocId>0 && x.docTypeId==34)
                            {
                              pkDocList.push({dmsDocId:x.dmsDocId,createDate:x.modifiedDt==' '?x.createdDt:x.modifiedDt,pensionerId:x.pensionerId,docName:"Pension Kit"})
                            }else if(x.dmsDocId>0 && x.docTypeId==35)
                              {
                                pkDocList.push({dmsDocId:x.dmsDocId,createDate:x.modifiedDt==' '?x.createdDt:x.modifiedDt,pensionerId:x.pensionerId,docName:"Pension Set"})
                              }
                        })
                      }
                  }
              })
              setTimeout(() => {
              console.log("pkDocList",pkDocList);
              const currentDialog = this.dialog.open(DashboardDialogComponent, {
                panelClass: 'small-dialog',
                autoFocus: false,
                width: '40%',
                height: '40%',
                data: {
                  dialogText: "Pension Kit List",
                  id: 17,
                  pkDocList:pkDocList
                },
              });
              }, 500);
            }
         
        }
    })
    
  }else if(i==2)
  {

  }
}
uploadPDF(event: any, callbackFn: any = null) {

  let time1 = new Date();

  let file = event.target.files[0];
  let ex2: any[] = file.name.split(".");
  console.log("size", file.size / 1024)
  if (ex2[1].includes('PDF') || ex2[1].includes('pdf')) {

  } else {
    alert("Only PDF file format allowed")
    return;
  }

  if ((file.size / 1024) > 2048) {
    alert("Max 2 MB file size allowed")
    return;
  }

  let fileName = "doc" + time1.getDate() + (time1.getMonth() + 1) + time1.getFullYear() + time1.getHours() + time1.getMinutes() + time1.getMilliseconds().toString() + ".pdf";
  fileName = fileName.replace(" ", "")
  var data4: any;
  const reader = new FileReader();
  //return;
  reader.onloadend = () => {
    data4 = reader.result;
    let data5 = data4.toString()
    let data6: any[] = [];
    data6 = data5.split("base64,")

    //console.log(data6);
    let data1 = {
      "type": "pdf",
      "sourceId": 2,
      "docAttributes": [

      ],
      "data": [{
        "docTypeId": "1",
        "docTypeName": "pdf",
        "docName": fileName,
        "docTitle": "pension",
        "content": data6[1]
      }]
    }
    console.log("data", data1);
    this.load.show();
    this.apiService.postOr("wcc/uploaddocs", data1).subscribe((res: any) => {
     
      this.load.hide();
      if (typeof callbackFn == 'function') {
        callbackFn(res);
      }
    }, (error) => {
      this.load.hide();
      alert("Some Error Occured")
    })
  };
  reader.readAsDataURL(file);



}
}
