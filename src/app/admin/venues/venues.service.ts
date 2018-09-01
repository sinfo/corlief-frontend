import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from '../../../environments/environment';
import { StorageService } from 'src/app/storage.service';
import { Credentials } from '../login/credentials';

import { Venue } from './venue';

@Injectable({
  providedIn: 'root'
})

export class VenuesService {

  corlief: String = environment.corlief;
  credentials: Credentials;

  constructor(private http: HttpClient, private storage: StorageService) {
    this.credentials = <Credentials>this.storage.getItem('credentials');
  }

  getLatestVenue(): Observable<Venue> {
    const headers = new HttpHeaders({
      Authorization: `${this.credentials.user} ${this.credentials.token}`
    });

    return this.http.get<Venue>(`${this.corlief}/venue`, { headers: headers });
  }

}
