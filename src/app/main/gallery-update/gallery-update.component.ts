import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gallery-update',
  templateUrl: './gallery-update.component.html',
  styleUrls: ['./gallery-update.component.scss']
})
export class GalleryUpdateComponent{
 galleryForm: FormGroup;
  imageFiles: File[] = [];
  previewUrls: string[] = [];
  editId: number | null = null; // null = insert, not null = update

  constructor(private fb: FormBuilder) {
    this.galleryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // Handle multiple file selection
  onImagesSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imageFiles = Array.from(event.target.files);
      this.previewUrls = [];

      this.imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => this.previewUrls.push(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  }

  // Submit form for insert/update
  onSubmit() {
    if (this.galleryForm.invalid) return;

    const imagesArray = this.imageFiles.map((file, index) => ({
      imageName: file.name,
      docId: index + 1 // replace with backend docId logic if needed
    }));

    const payload: any = {
      inType: this.editId ? 2 : 1, // 1 = insert, 2 = update
      name: this.galleryForm.value.name,
      images: imagesArray
    };

    if (this.editId) {
      payload.id = this.editId;
    }


  }

  // Load a gallery for edit
  loadForEdit(gallery: any) {
    this.editId = gallery.id;
    this.galleryForm.patchValue({ name: gallery.name });
    this.previewUrls = gallery.images.map((img: any) => img.imageName);
  }
}