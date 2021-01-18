import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent, DetailComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,CKEditorModule , FormsModule ,NgxPaginationModule,
    DragDropModule,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class BlogModule { }
