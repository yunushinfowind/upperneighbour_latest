import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { FormsModule } from '@angular/forms';
import { HashtagComponent } from './hashtag/hashtag.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';




@NgModule({
  declarations: [DashboardComponent, AdminComponent, ChangepasswordComponent,  HashtagComponent, EditProfileComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,SharedModule, FormsModule,
    DragDropModule,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class AdminModule { }
