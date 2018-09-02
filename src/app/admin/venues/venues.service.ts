import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { environment } from '../../../environments/environment';
import { StorageService } from 'src/app/storage.service';
import { Credentials } from '../login/credentials';

import { Venue } from './venue/venue';
import { Stand } from './venue/stand';

@Injectable({
  providedIn: 'root'
})

export class VenuesService {

  corlief: String = environment.corlief;
  headers: HttpHeaders;
  venue: Venue;
  venueSubject: BehaviorSubject<Venue> = new BehaviorSubject<Venue>(undefined);

  constructor(private http: HttpClient, private storage: StorageService) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.headers = new HttpHeaders({
      Authorization: `${credentials.user} ${credentials.token}`
    });
  }

  setVenue(venue: Venue) {
    this.venue = venue;
    this.venueSubject.next(venue);
  }

  getVenueSubject() {
    return this.venueSubject.asObservable();
  }

  getCurrentVenue(): Observable<Venue> {
    return this.http.get<Venue>(`${this.corlief}/venue/current`, { headers: this.headers });
  }

  uploadStand(stand: Stand): Observable<Venue> {
    return this.http.post<Venue>(`${this.corlief}/venue/stand`, stand, { headers: this.headers });
  }

  deleteStand(id: number): Observable<Venue> {
    return this.http.delete<Venue>(`${this.corlief}/venue/stand/${id}`, { headers: this.headers });
  }
}
