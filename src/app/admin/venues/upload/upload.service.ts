import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from '../../../../environments/environment';
import { LoginService } from '../../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  corlief: String = environment.corlief;
  headers: HttpHeaders;

  constructor(private http: HttpClient, private loginService: LoginService) {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.loginService.getToken()}`
    });
  }

  upload(image: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', image);

    const req = new HttpRequest('POST', `${this.corlief}/venue/image`, formdata, {
      headers: this.headers,
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
}
