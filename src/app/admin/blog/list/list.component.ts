import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from '../blog.service';
import * as $ from 'jquery';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  List: any;
  currentDrageList: any;
  total: any;
  per_page: any;
  currentPage: any;
  dtOptions: DataTables.Settings = {};
  showLoader: boolean = false;
  convertedArray: any

  constructor(private blogService: BlogService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.blogList(1);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    }
    this.currentPage = 1;
    this.getCurrentList();

  }

  blogList(page) {
    this.showLoader = true;
    let search = ($('.table_search').val()) ? ($('.table_search').val()) : '';
    this.blogService.blogList(page, search).subscribe(
      result => {
        this.List = result.data;
        if (result.success == true) {
          this.showLoader = false;
          this.List = result.data.rows;
          console.log(this.List);
          this.total = result.data.count;
          this.currentPage = result.data.currentPage;
        }
      },
      error => {

      }
    )
  }

  deleteBlog(id: any) {
    if (confirm("Are you sure to delete ?")) {
      this.blogService.deleteBlog(id).subscribe(
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

  resetSearch() {
    $('.table_search').val('');
    this.blogList(1);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event.previousIndex);
    console.log(event.currentIndex);
    console.log(this.currentDrageList[event.previousIndex]);
    console.log(this.currentDrageList[event.currentIndex]);
    console.log(this.List);
    moveItemInArray(this.List, event.previousIndex, event.currentIndex);
    var previousIndex = event.previousIndex;
    var currentIndex = event.currentIndex;
    var swapLength = Math.abs(previousIndex - currentIndex);
    var currArraylenght = this.currentDrageList.length;

    console.log('length:' + swapLength)
    console.log('lengtharr:' + this.currentDrageList.length)
    var temp = this.currentDrageList[event.previousIndex];
    var currArry = this.currentDrageList;
    console.log('previous Index:' + previousIndex)
    console.log('Current Index:' + currentIndex)
    if (swapLength > 1) {
      if (previousIndex < currentIndex) {
        console.log('froword')
        for (let i = previousIndex; i <= swapLength; i++) {
          currArry[i] = currArry[i + 1];
        }
      } else {
        console.log('backword')
        for (let i = previousIndex; i >= currentIndex; i--) {
          currArry[i] = currArry[i - 1];
        }
      }
      currArry[currentIndex] = temp;
    } else {
      currArry[previousIndex] = this.currentDrageList[event.currentIndex];
      currArry[currentIndex] = temp;
    }
    console.log(this.currentDrageList)
    console.log(currArry)
    this.convertedArray = currArry;
    this.updateOrderOfList();
  }

  getCurrentPage() {
    this.currentPage = $('#second ul .current span').eq(1).text();
    this.getCurrentList();
  }
  /*to update order of list*/
  updateOrderOfList() {
    var formData = new FormData();
    formData.append('data[]', JSON.stringify(this.convertedArray));
    formData.append('page', this.currentPage);
    formData.append('model', 'blog');
    this.blogService.updateOrder(formData).subscribe(
      result => {
        console.log('order response')
        console.log(result);
        if (result.success == true) {
          this.blogList(this.currentPage)
          $('#second ul .current span').eq(1).trigger('click')
          this.toastr.success('Order changed successfully.')
        }
      }
    )
  }

  getCurrentList() {
    this.blogService.getCurrentDragList(this.currentPage, 'blog').subscribe(
      result => {
        if (result.success == true) {
          this.currentDrageList = result.data.rows;
          // console.log(this.currentDrageList)
        }
      }
    )
  }

}
