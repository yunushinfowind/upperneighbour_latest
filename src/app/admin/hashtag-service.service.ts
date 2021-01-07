import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HashtagServiceService {

  baseUrl:string="";
 
  constructor(private router: Router, private httpclient: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  hashtagDetail(id: any) {
    var params = "hashtag";
    const result = this.httpclient.get(this.baseUrl + '/admin/hashtag/' + params
    );
    return result.pipe(map((response: any) => {
      return response;
    }));
  }

  editHashtag(teacherForm: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const result = this.httpclient.post(this.baseUrl + '/admin/edit-hashtag', teacherForm);
    return result.pipe(map((response: any) => {
      return response;
    }));
  }
}
