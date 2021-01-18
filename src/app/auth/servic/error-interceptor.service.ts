import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/service/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

    token_status: boolean;
    baseUrl: string = "";
    constructor(private toastr: ToastrService , private router: Router, private authenticationService: AuthService, private httpclient: HttpClient) {
        this.baseUrl = environment.baseUrl;
    }



    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        return next.handle(request).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    if (evt.body && evt.body.type == 'token_invalid') {
                        this.toastr.error('Sorry , Session has been expired.')
                        localStorage.removeItem('currentUser');
                        // this.router.navigate(['/']);
                        window.location.reload();
                    }
                }
            }),
            catchError(err => {
                console.log(err)
                if (err.status === 401) {
                    // auto logout if 401 response returned from api
                    this.authenticationService.logout();
                    location.reload(true);
                }

                const error = err.error.message || err.statusText;
                return throwError(error);
            }
            )
        )
    }
}