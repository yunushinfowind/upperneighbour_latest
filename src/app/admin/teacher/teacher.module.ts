import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [AddComponent, UpdateComponent,  ListComponent, DetailComponent],
  imports: [
    CommonModule,
    TeacherRoutingModule , FormsModule , NgxPaginationModule ,
    DragDropModule,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class TeacherModule { }
