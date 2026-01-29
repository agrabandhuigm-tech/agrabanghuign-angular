import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdfpreview',
  templateUrl: './pdfpreview.component.html',
  styleUrls: ['./pdfpreview.component.scss'],
  standalone: false
})
export class PdfpreviewComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { message: any },
    public router: Router,
    public dialog: MatDialog) { }

  base64data: any;

  ngOnInit(): void {
    this.preview();
  }

  preview() {
    //data:image/jpeg;base64  
    let base = this.data.message.base64Pdf;
    this.base64data = 'data:application/pdf;base64,' + base;
    /* console.log('base64', this.base64data); */
    if (base) {
      this.base64data = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(base) as any).changingThisBreaksApplicationSecurity;
      if (top?.document.getElementById('ifrm')) {
        top.document.getElementById('ifrm')?.setAttribute('src', this.base64data);
      }
    }
  }
  redirectToBack() {
    this.router.navigate([this.data.message.redirectUrl]);
    this.dialog.closeAll();
  }

  closeWindow() {
    this.dialog.closeAll();
  }

}
