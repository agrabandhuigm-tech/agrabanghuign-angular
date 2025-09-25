// pdf-check.service.ts
import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

@Injectable({
  providedIn: 'root'
})
export class PdfCheckService {

  constructor() {
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }

  async containsText(base64: string, searchText: string): Promise<boolean> {
    try {
      // Remove prefix if present
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

      // Decode base64 → Uint8Array
      const binaryData = atob(base64Data);
      const len = binaryData.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      // Load PDF
      const loadingTask = (pdfjsLib as any).getDocument({ data: bytes });
      const pdf = await loadingTask.promise;

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(' ') + ' ';
      }

      return fullText.toLowerCase().includes(searchText.toLowerCase());
    } catch (error) {
      console.error('Error reading PDF:', error);
      return false;
    }
  }
}
