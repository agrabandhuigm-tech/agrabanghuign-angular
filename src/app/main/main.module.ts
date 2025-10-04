import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { CommonSharedModule } from '../common/common.module';
import { DatePipe } from '@angular/common';
import { MydashboardComponent } from './mydashboard/mydashboard.component';
import { PdfpreviewComponent } from './pdfpreview/pdfpreview.component';
import { CommonDialogueBoxComponent } from './common-dialogue-box/common-dialogue-box.component';
import { AboutMaharajComponent } from './about-maharaj/about-maharaj.component';
import { FooterComponent } from './footer/footer.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { UploadBiodataComponent } from './upload-biodata/upload-biodata.component';
import { MarriageBiodataListComponent } from './marriage-biodata-list/marriage-biodata-list.component';
import { GalleryUpdateComponent } from './gallery-update/gallery-update.component';
import { GalleryViewComponent } from './gallery-view/gallery-view.component';
import { FullGalleryViewComponent } from './full-gallery-view/full-gallery-view.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Dashboard',
    pathMatch: 'full',
  },

  { path: 'Dashboard', component: MydashboardComponent },
  { path: 'about-maharaj', component: AboutMaharajComponent },
  { path: 'preview', component: ImagePreviewComponent },
  { path: 'upload-biodata', component: UploadBiodataComponent },
  { path: 'marriage-bio-list', component: MarriageBiodataListComponent },
  { path: 'gallery-update', component: GalleryUpdateComponent },
  { path: 'gallery-view', component: GalleryViewComponent },
  { path: 'full-gallery-view', component: FullGalleryViewComponent },
];

@NgModule({
  declarations: [
    MydashboardComponent,
    PdfpreviewComponent,
    CommonDialogueBoxComponent,
    AboutMaharajComponent,
    FooterComponent,
    ImagePreviewComponent,
    UploadBiodataComponent,
    MarriageBiodataListComponent,
    GalleryUpdateComponent,
    GalleryViewComponent,
    FullGalleryViewComponent,
    ImageViewerComponent,
  ],

  imports: [
    RouterModule.forChild(routes),
    MatOptionModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    CommonModule,
    CommonSharedModule,
    SharedModule,
  ],
  providers: [DatePipe],
})
export class mainModule {}
