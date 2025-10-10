import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.scss']
})
export class GalleryViewComponent implements OnInit {
galleryList:any[]=[]
  constructor(   private apiService: ApiService,
      public common: CommonService,
      private load: LoaderService,
    private router:Router) { }

  ngOnInit(): void {
    this.getGalleryList();
  }
getGalleryList(){
  let submitData = {
              requestJson: {
                inType: 3
                
              },
            };
  this.apiService.post('getGallery', submitData).subscribe((res: any) => {
      console.log(res);
      this.load.hide();
      if (JSON.stringify(res).includes('name')) {
       let data=JSON.parse(res.data[0].result);
       this.galleryList=data;
       console.log("gallery",this.galleryList)
       this.getbase64();
      } else {
       this.galleryList=[];
      }
    });
}
base64Array:any[]=[];

getbase64()
{
  this.galleryList.forEach(element => {  
      let uploadfiledata = {
        requestJson: {
           inType: 2,
           docId:element?.images[0]?.docId
        },
      };

    this.apiService.post('uploadFiles', uploadfiledata).subscribe({
        next: (res: any) => {
 console.log("res",res);
 if(JSON.stringify(res).includes('filetype'))
 {
  
   this.base64Array.push(res.data[0]);
    console.log("base64Array",this.base64Array);
 }
        },
        error: () => {
        
        },
      });
      });
}
viewGallary(data:any)
{
  this.common.setDetails(data?.images);
this.router.navigate(['full-gallery-view'])
}

}
