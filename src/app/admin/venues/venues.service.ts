import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { environment } from '../../../environments/environment';

import { StorageService } from '../../storage.service';

import { Credentials } from '../login/credentials';
import { Venue } from './venue/venue';
import { Stand } from './venue/stand';
import { Company } from '../links/link/company';

@Injectable({
  providedIn: 'root'
})

export class VenuesService {

  url: String = `${environment.corlief}/venue`;
  headers: HttpHeaders;

  credentials: Credentials;
  venue: Venue;

  venueSubject: BehaviorSubject<Venue> = new BehaviorSubject<Venue>(undefined);

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;
    this.headers = new HttpHeaders({
      Authorization: `${credentials.user} ${credentials.token}`,
    });
  }

  getVenue(): Venue {
    return this.venue;
  }

  setVenue(venue: Venue) {
    this.venue = venue;
    this.venueSubject.next(venue);
  }

  getVenueSubject(): Observable<Venue> {
    return this.venueSubject.asObservable();
  }

  getCurrentVenue(): Observable<Venue> {
    return this.http.get<Venue>(`${this.url}/current`, { headers: this.headers });
  }

  uploadStand(stand: Stand): Observable<Venue> {
    return this.http.post<Venue>(`${this.url}/stand`, stand, { headers: this.headers });
  }

  deleteStand(id: number): Observable<Venue> {
    return this.http.delete<Venue>(`${this.url}/stand/${id}`, { headers: this.headers });
  }
}
