import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { ArtistVideoService } from '../artist-video.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  List: any;
  total: any;
  per_page: any;
  currentPage: any;
  dtOptions: DataTables.Settings = {};
  showLoader : boolean = true;
  sliceButtonDisable: boolean = true
  user_id:any;
  routine_id:any;
  notationFile: any;
  video_id: any;
  convertedArray :any
  currentDrageList:any;

  constructor(private activatedRoute :ActivatedRoute, private artistVideoService: ArtistVideoService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.user_id = params['user_id'];
      this.routine_id = params['routine_id'];
      console.log(params)
    })
    this.artistVideoList(1);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    }
    this.currentPage = 1;
    this.getCurrentList();
  }
  

  artistVideoList(page) {
    let search = ($('.table_search').val())?($('.table_search').val()):'';
    this.artistVideoService.artistVideoList(page,this.user_id,search).subscribe(
      result => {
        this.List = result.data;
        if (result.success == true) {
          this.showLoader = false;
          this.List = result.data.rows;
          this.total = result.data.count;
          this.currentPage = result.data.currentPage;
          console.log(this.List)
        }
      },
      error => {

      }
    )
  }

  handlePageChange(page){
    this.currentPage = page;
    this.artistVideoList(this.currentPage);
  }

  deleteArtistVideo(id: any) {
    if (confirm("Are you sure to delete ?")) {
      this.artistVideoService.deleteArtistVideo(id).subscribe(
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

  createVideoSliceRecordong(videoId, folderId) {
    let postData = {
      video_id: videoId,
      folder_id: folderId
    }
    console.log(postData);
    // this.showButtonLoader = true;
    this.sliceButtonDisable = false;
    $('#loader_' + videoId).show();
    this.artistVideoService.createVideoSliceRecordong(postData).subscribe(result => {
      if (result.success) {
        $('#loader_' + videoId).hide();
        $('#slice_' + videoId).attr('disabled', 'true');
        // this.showButtonLoader = false;
        this.sliceButtonDisable = true;
        this.toastr.success(result.message);
      } else {
        this.toastr.error(result.message)
      }
    }
    )
  }
  

  addSliceNotation(f: NgForm) {
    console.log(this.notationFile);
    //f.valid && this.notationFile
  if (this.notationFile) {
      const formData = new FormData();
      $('#loader_notation_' + this.video_id).show();
      formData.append('video_id', this.video_id);
      formData.append('notation_file', this.notationFile);
      this.artistVideoService.addNotation(formData).subscribe(result => {
        if (result.success) {
          $('#loader_notation_' + this.video_id).hide();
          this.toastr.success(result.message);
          $('#notation_dis_' + this.video_id).show();
          $('#notation_' + this.video_id).attr('disabled', 'true');
          $('#notation_' + this.video_id).prop('value', 'Added');
        } else {
          $('#loader_notation_' + this.video_id).hide();
          this.toastr.error(result.message)
        }
      }
      )
    }
  }


  onFileChange(event, videoId) {
    if ($("#slice_" + videoId).is(":disabled") || $("#slice_dis_" + videoId).is(":disabled")) {
      this.video_id = videoId;
      const reader = new FileReader();
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        var type = file.name.split('?')[0].split('.').pop();
        var re = /(\.musicxml|\.xml|\.xml|\.gp3|\.gp4|\.gp4|\.gp5|\.gpx|\.gp|\.ptb|\.tg)$/i;
        if (!re.exec(file.name)) {
          this.toastr.error('Sorry this type of not supported, Please upload notation file type')
          $('#notation_file').val('');
        } else {
          this.notationFile = file;
        }
      }
    } else {
      this.toastr.error('Please add slice first');
      $('#notation_file').val('');
      return
    }
  }


  resetSearch(){
    $('.table_search').val('');
    this.artistVideoList(1);
  }

  
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.List, event.previousIndex, event.currentIndex);
    var previousIndex = event.previousIndex;
    var currentIndex = event.currentIndex;
    var swapLength = Math.abs(previousIndex-currentIndex);
    var currArraylenght =this.currentDrageList.length;
    var temp = this.currentDrageList[event.previousIndex];
    var currArry = this.currentDrageList;
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

  getCurrentPage(){
    this.getCurrentList();
  }
  /*to update order of list*/
  updateOrderOfList(){
    var formData = new FormData();
    formData.append('data[]', JSON.stringify(this.convertedArray));
    formData.append('page', this.currentPage);
    formData.append('model', 'artist_video');
    formData.append('user_id', this.user_id);
    this.artistVideoService.updateOrder(formData).subscribe(
      result => {
        if (result.success == true) {
          this.artistVideoList(this.currentPage)
          $('#second ul .current span').eq(1).trigger('click')
          this.toastr.success('Order changed successfully.')
        }
      }
    )
  }

  getCurrentList(){
    this.artistVideoService.getCurrentDragList(this.currentPage,this.user_id,'artist_video').subscribe(
      result => {
        if (result.success == true) {
          this.currentDrageList = result.data.rows;
        }
      }
    )
  }

}
