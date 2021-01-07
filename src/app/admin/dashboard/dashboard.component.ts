import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountServiceService } from '../account-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  allCounts:any;
  constructor(private router: Router,private accountService: AccountServiceService, private toastr: ToastrService) {
    
  }

  ngOnInit(): void {
    this.getDashboardCount();
  }
 

 getDashboardCount() {

    this.accountService.getDashboardCount().subscribe(
      res => {
        if (res.success) {
          console.log('res.data');
          console.log(res.data);
          this.allCounts = res.data;
        } else {
          this.toastr.error(res.message)
        }
      },
      err => {
      }
    )
  
}


}
