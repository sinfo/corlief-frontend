import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';

import { environment } from '../../../environments/environment';

import { VenuesService } from '../venues/venues.service';
import { StorageService } from '../../storage.service';

import { Credentials } from '../login/credentials';
import { Event } from './event';
import { Venue } from '../venues/venue/venue';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  deck = `${environment.deck}/api`;
  credentials: Credentials;

  eventSubject: BehaviorSubject<Event> = new BehaviorSubject<Event>(undefined);
  venueSubscription: Subscription;

  headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private venues: VenuesService,
    private storage: StorageService
  ) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${credentials.user} ${credentials.token}`
    });

    this.venueSubscription = this.venues.getVenueSubject()
      .subscribe(venue => {
        if (venue) {
          this.updateEvent(venue.edition);
        }
      });
  }

  getEventSubject(): Observable<Event> {
    return this.eventSubject.asObservable();
  }

  updateEvent(edition: String) {
    if (edition === undefined) { return; }

    const { user, token } = this.credentials;

    this.http.get(`${this.deck}/auth/login/${user}/${token}`)
      .subscribe(() => {
        this.http.get<[Event]>(`${this.deck}/events`, { withCredentials: true })
          .subscribe(events => {
            const filtered = events.filter(e => e.id === edition);
            if (filtered.length > 0) {
              const event = filtered[0];

              event.date = new Date(event.date);
              event.duration = new Date(event.duration);

              this.eventSubject.next(event);
            }
          });
      });
  }
}
