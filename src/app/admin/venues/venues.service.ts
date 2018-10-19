import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

import { environment } from '../../../environments/environment';

import { StorageService } from '../../storage.service';

import { Credentials } from '../login/credentials';
import { Venue, Availability } from './venue/venue';
import { Stand } from './venue/stand';
import { Company } from 'src/app/deck/company';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VenuesService {

  private url: String = `${environment.corlief}/venue`;
  private headers: HttpHeaders;

  private credentials: Credentials;
  private venue: Venue;
  private availability: Availability;

  private venueSubject: ReplaySubject<Venue>
    = new ReplaySubject<Venue>();

  private availabilitySubject: ReplaySubject<Availability>
    = new ReplaySubject<Availability>(null);

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;
    this.headers = credentials ? new HttpHeaders({
      Authorization: `${credentials.user} ${credentials.token}`,
    }) : new HttpHeaders();
  }

  // ------------ Venue ------------

  getVenue(edition?: String): Observable<Venue> {
    if (this.venue && this.venue.edition === edition) {
      return of(this.venue);
    }

    if (edition === undefined) {
      return this.getCurrentVenue();
    }

    return this.getVenueFromEdition(edition);
  }

  setVenue(venue: Venue) {
    this.venue = venue;
    this.venueSubject.next(venue);
  }

  getVenueSubject(): Observable<Venue> {
    return this.venueSubject.asObservable();
  }

  // ------------ Availability ------------

  setAvailability(availability: Availability) {
    this.availability = availability;
    this.availabilitySubject.next(availability);
  }

  getAvailabilitySubject(): Observable<Availability> {
    return this.availabilitySubject.asObservable();
  }

  getAvailability() {
    return this.availability;
  }

  // ------------ HTTP requests ------------

  private getVenueFromEdition(edition: String): Observable<Venue> {
    return this.http.get<Venue>(`${this.url}/${edition}`, { headers: this.headers });
  }

  private getCurrentVenue(): Observable<Venue> {
    return this.http.get<Venue>(`${this.url}/current`, { headers: this.headers });
  }

  uploadStand(stand: Stand): Observable<Venue> {
    return this.http.post<Venue>(`${this.url}/stand`, stand, { headers: this.headers });
  }

  deleteStand(id: number): Observable<Venue> {
    return this.http.delete<Venue>(`${this.url}/stand/${id}`, { headers: this.headers });
  }
}
