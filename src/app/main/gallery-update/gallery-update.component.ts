import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoaderInterceptor } from 'src/app/interceptors/loader.interceptor';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-gallery-update',
  templateUrl: './gallery-update.component.html',
  styleUrls: ['./gallery-update.component.scss'],
  standalone: false
})
export class GalleryUpdateComponent {
  galleryForm: FormGroup;
  imageFiles: File[] = [];
  previewUrls: string[] = [];
  editId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public common: CommonService,
    private load: LoaderService,
    private router: Router
  ) {
    this.galleryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.galleryForm.invalid) return;
    if (this.images.length < 1) return;

    this.load.show();
    let pending = this.images.length; // track pending uploads
    this.docList = []; // reset before push

    this.images.forEach((e: any) => {
      let uploadfiledata = {
        requestJson: {
          inType: 1,
          filename: e.file.name,
          filetype: 'image',
          filedata: e.url,
        },
      };

      this.apiService.post('uploadFiles', uploadfiledata).subscribe({
        next: (res: any) => {
          pending--;
          console.log(res.data[0].message);
          if (res.data[0].message > 0) {
            this.docList.push({
              docId: res.data[0].message,
              docName: e.file.name,
            });
          }
          console.log(this.docList);
          if (pending === 0 && this.docList.length > 0) {
            let submitData = {
              requestJson: {
                inType: 1,
                name: this.galleryForm.value.name,
                images: this.docList,
              },
            };
            this.insertGallery(submitData); // ✅ call after all uploads done
          }
        },
        error: () => {
          pending--;
          if (pending === 0 && this.docList.length > 0) {
            let submitData = {
              requestJson: {
                inType: 1,
                name: this.galleryForm.value.name,
                images: this.docList,
              },
            };
            this.insertGallery(submitData); // still call even if some failed
          }
        },
      });
    });
  }

  private insertGallery(submitData: any) {
    this.apiService.post('getGallery', submitData).subscribe((res: any) => {
      console.log(res);
      this.load.hide();
      if (JSON.stringify(res).includes('Inserted successfully')) {
        this.router.navigate(['gallery-view'])
        alert('Gallery Inserted');
      } else {
        alert('Error in Insert');
      }
    });
  }

  images: { file: File; url: string }[] = [];
  docList: any[] = [];
  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push({ file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }
}
