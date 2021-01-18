import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { TeacherService } from '../teacher.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  List: any;
  currentDrageList:any;
  total: any;
  per_page: any;
  currentPage: any;
  // dtOptions: DataTables.Settings = {};
  showLoader: boolean = true;
  items = [];
  pageOfItems: Array<any>;
  convertedArray :any
  constructor(private teacherService: TeacherService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.teacherList(1);
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   processing: true
    // }
    this.currentPage = 1;
    this.getCurrentList();

  }

  teacherList(page) {
    let search = ($('.table_search').val()) ? ($('.table_search').val()) : '';
    this.teacherService.teacherList(page, search).subscribe(
      result => {
        // this.List = result.data;
        if (result.success == true) {
          this.showLoader = false;
          this.List = result.data.rows;
          this.items = result.data.rows
          this.total = result.data.count;
          this.currentPage = result.data.currentPage;
        }
      },
      error => {

      }
    )
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  changeStatus(id: any , status:any) {
    if (confirm("Are you sure to change status ?")) {
      let postData = {
        user_id:id,
      }
      this.teacherService.updateStatus(postData).subscribe(
        result => {
          if (result.success == true) {
            this.toastr.success(result.message);
            if(result.data.status=='active'){
              $('.status_'+id).prop('checked',true);
            }else{
              $('.status_'+id).prop('checked',false);
            }
          }
        }
      )
    }else{
      if(status){
        $('.status_'+id).prop('checked',true);
      }else{
        $('.status_'+id).prop('checked',false);
      }
    }
  }

  deleteTeacher(id: any) {
    if (confirm("Are you sure to delete ?")) {
      this.teacherService.deleteTeacher(id).subscribe(
        result => {
          if (result.success == true) {
            this.toastr.success(result.message);
            $('#row_' + id).remove();
          }
        },
        error => {

        }
      )
    }
  }
  resetSearch(){
    $('.table_search').val('');
    this.teacherList(1)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.List, event.previousIndex, event.currentIndex);
    var previousIndex = event.previousIndex;
    var currentIndex = event.currentIndex;
    var swapLength = Math.abs(previousIndex-currentIndex);
    var currArraylenght =this.currentDrageList.length;
    var temp = this.currentDrageList[event.previousIndex];
    var currArry = this.currentDrageList;
    if (previousIndex < currentIndex) {
      for (let i = previousIndex; i <= swapLength; i++) {
        currArry[i] = currArry[i + 1];
      }
    } else {
      for (let i = previousIndex; i >= currentIndex; i--) {
        currArry[i] = currArry[i + 1];
      }
    }
     currArry[currentIndex] = temp;
     this.convertedArray = currArry;
     console.log('current Arr')
     console.log(this.currentDrageList)
     console.log('updated Arr')
     console.log(currArry)
     this.updateOrderOfList();
  }

  getCurrentPage(){
    this.currentPage = $('#second ul .current span').eq(1).text();
    this.getCurrentList();
  }
  /*to update order of list*/
  updateOrderOfList(){
    var formData = new FormData();
    formData.append('data[]', JSON.stringify(this.convertedArray));
    formData.append('page', this.currentPage);
    formData.append('model', 'teacherProfile');
    this.teacherService.updateOrder(formData).subscribe(
      result => {
        if (result.success == true) {
          this.teacherList(this.currentPage)
          $('#second ul .current span').eq(1).trigger('click')
          this.toastr.success('Order changed successfully.')
        }
      }
    )
  }

  getCurrentList(){
    this.teacherService.getCurrentDragList(this.currentPage,'artist').subscribe(
      result => {
        if (result.success == true) {
          this.currentDrageList = result.data.rows;
          // console.log(this.currentDrageList)
        }
      }
    )
  }

}
