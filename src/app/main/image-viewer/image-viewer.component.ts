import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent {

   currentIndex: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { images: string[], index: number },
    private dialogRef: MatDialogRef<ImageViewerComponent>
  ) {
    this.currentIndex = data.index;
  }
next() {
    this.currentIndex = (this.currentIndex + 1) % this.data.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.data.images.length) % this.data.images.length;
  }

  close() {
    this.dialogRef.close();
  }
}