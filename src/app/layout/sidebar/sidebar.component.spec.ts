import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';

import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { ApiUrlService } from 'src/app/services/api-url.service';
import { ApiService } from 'src/app/services/api.service';
import { AppConfig } from 'src/app/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


describe('SidebarComponent', () => {


  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });






});


// previewFiles(){

//   alert("Response Data Is Blank that's why here don't get Doc ID .")
// // console.log(item);
// console.log(this.pensionerInfoResult[0].pensionKitId)
// let dmsDocId=this.pensionerInfoResult[0].pensionKitId;
// if(dmsDocId =this.pensionerInfoResult[0].pensionKitId)
// {
// let data={
//   "type": "pension",
//   "sourceId": 2,
//   "docs": [
//     {
//       "docId": this.pensionerInfoResult[0].pensionKitId
//     }
//   ]
// }
// console.log("single report data",data)
// this.api.postIntegration("wcc/getfiles",data).subscribe((res:any)=>{
//   console.log("res",res.data.document[0].content);
//   if(res.data.document[0].content)
  
//   {
//     let data={
//       "base64Pdf":res.data.document[0].content,"redirectUrl":"pensioner/pssdashboard" }
//          console.log("data",data);
//      //this.dialog.open(PdfpreviewComponent,{  width: '70%', data: {message: data },  disableClose: false});           
//   }
// })
// }else
// {
// alert("Preview Not Available")
// }
// }

