import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-gallery-update',
  templateUrl: './gallery-update.component.html',
  styleUrls: ['./gallery-update.component.scss']
})
export class GalleryUpdateComponent {
  galleryForm: FormGroup;
  imageFiles: File[] = [];
  previewUrls: string[] = [];
  editId: number | null = null;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    public common: CommonService) {
    this.galleryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }



  onSubmit() {
    if (this.galleryForm.invalid) return;
    let submitData = {
      "requestJson": {
        "inType": 1,
        "gName": this.galleryForm.value.name,
        "images": this.docList
      }
    };

  }



  images: { file: File, url: string }[] = [];
  docList: any[] = [];
  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push({ file, url: e.target.result });
        let uploadfiledata = {
          "requestJson": {
            "inType": 1,
            "filename": file.name,
            "filetype": "image",
            "filedata": e.target.result
          }
        }
        this.apiService.post("uploadFiles", uploadfiledata).subscribe((res: any) => {
          console.log(res);
          if (res.data.message > 0) {
            this.docList.push({ docId: res.data.message, docName: file.name });
          } else {

          }
        })
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }
}