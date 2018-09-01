import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from '../../../environments/environment';
import { StorageService } from 'src/app/storage.service';
import { Credentials } from '../login/credentials';

import { Venue } from './venue/venue';

@Injectable({
  providedIn: 'root'
})

export class VenuesService {

  corlief: String = environment.corlief;
  headers: HttpHeaders;

  constructor(private http: HttpClient, private storage: StorageService) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.headers = new HttpHeaders({
      Authorization: `${credentials.user} ${credentials.token}`
    });
  }

  getCurrentVenue(): Observable<Venue> {
    return this.http.get<Venue>(`${this.corlief}/venue/current`, { headers: this.headers });
  }
}
