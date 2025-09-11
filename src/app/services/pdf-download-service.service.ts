import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PdfDownloadServiceService {

  constructor(private http: HttpClient) { }

  downloadPdf(url: string, filename: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      saveAs(blob, filename);
    });
  }
}
