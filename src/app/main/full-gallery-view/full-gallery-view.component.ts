import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-full-gallery-view',
  templateUrl: './full-gallery-view.component.html',
  styleUrls: ['./full-gallery-view.component.scss']
})
export class FullGalleryViewComponent  {
 images: string[] = [
    'assets/gallery/nature.jpg',
    'assets/gallery/city.jpg',
    'assets/gallery/beach.jpg'
  ];
base64Array:any[]=[]
constructor(private dialog: MatDialog,public common:CommonService,private apiService:ApiService) {
    this.common.DetailsCast.subscribe((res:any)=>
    {
      console.log(res);
      this.getbase64(res)
    
    }
    )
  }
getbase64(list:any[])
{
  list.forEach(element => {  
      let uploadfiledata = {
        requestJson: {
           inType: 2,
           docId:element?.docId
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
  openViewer(index: number): void {
    this.dialog.open(ImageViewerComponent, {
      data: { images: this.base64Array, index: index },
      panelClass: 'custom-dialog-container',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }
}
