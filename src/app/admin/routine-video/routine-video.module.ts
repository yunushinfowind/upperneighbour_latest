import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutineVideoRoutingModule } from './routine-video-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { SafePipe } from '../../pipesafe/pipesafe.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [ListComponent, AddComponent, ViewComponent, EditComponent , SafePipe],
  imports: [
    CommonModule,
    RoutineVideoRoutingModule , FormsModule , ReactiveFormsModule , NgxPaginationModule,
    DragDropModule,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule
  
  ]
})
export class RoutineVideoModule { }
