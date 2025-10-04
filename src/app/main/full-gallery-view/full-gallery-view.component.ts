import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

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

  constructor(private dialog: MatDialog) {}

  openViewer(index: number): void {
    this.dialog.open(ImageViewerComponent, {
      data: { images: this.images, index: index },
      panelClass: 'custom-dialog-container',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }
}
