import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesVideoRoutingModule } from './series-video-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent, ViewComponent],
  imports: [
    CommonModule,
    SeriesVideoRoutingModule,FormsModule,ReactiveFormsModule , NgxPaginationModule,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class SeriesVideoModule { }
