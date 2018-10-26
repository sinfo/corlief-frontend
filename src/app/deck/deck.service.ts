import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { VenuesService } from '../admin/venues/venues.service';
import { StorageService } from '../storage.service';

import { Credentials } from '../admin/login/credentials';
import { Event } from './event';
import { Venue } from '../admin/venues/venue/venue';
import { Company } from './company';


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  public events: [Event];
  public event: Event;
  private companies: [Company];

  private deck = `${environment.deck}/api`;
  private credentials: Credentials;

  private eventSubject: ReplaySubject<Event> = new ReplaySubject<Event>();
  private deckCompaniesSubject: ReplaySubject<[Company]> = new ReplaySubject<[Company]>();

  private venueSubscription: Subscription;

  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private venues: VenuesService,
    private storage: StorageService
  ) {
    const credentials = <Credentials>this.storage.getItem('credentials');
    this.credentials = credentials;

    this.headers = credentials ? new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${credentials.user} ${credentials.token}`
    }) : undefined;

    this.venueSubscription = this.venues.getVenueSubject()
      .subscribe(venue => {
        if (venue) {
          this.updateEvent(venue.edition);
          this.getCompanies(venue.edition);
        }
      });
  }

  private deckAuth(): Observable<object> {
    const { user, token } = this.credentials ? this.credentials : { user: null, token: null };

    return user && token
      ? this.http.get(`${this.deck}/auth/login/${user}/${token}`, { withCredentials: true })
      : of(null);
  }

  private getCompanies(edition: String): void {
    this.deckAuth().subscribe(() => {
      this.http.get<[Company]>(
        `${this.deck}/companies?event=${edition}&&participations=true`,
        { withCredentials: true }
      ).subscribe(companies => this.deckCompaniesSubject.next(companies));
    });
  }

  getEventSubject(): Observable<Event> {
    return this.eventSubject.asObservable();
  }

  getDeckCompaniesSubject(): Observable<[Company]> {
    return this.deckCompaniesSubject.asObservable();
  }

  updateEvent(edition?: String) {
    if (this.event && edition && this.event.id === edition) { return; }

    const { user, token } = this.credentials ? this.credentials : { user: null, token: null };

    if (user && token) {
      this.deckAuth().subscribe(() => {
        this.http.get<[Event]>(`${this.deck}/events`, { withCredentials: true })
          .subscribe(events => {
            this.events = Event.fromArray(events).sort(Event.compare) as [Event];

            const filtered = edition
              ? events.filter(e => e.id === edition)[0]
              : events[events.length - 1];

            const event = new Event(filtered);
            this.event = event;
            this.eventSubject.next(event);

          });
      });
    } else {
      this.http.get<[Event]>(`${this.deck}/events`)
        .subscribe(events => {
          this.events = Event.fromArray(events).sort(Event.compare) as [Event];

          const filtered = edition
            ? events.filter(e => e.id === edition)[0]
            : events[events.length - 1];

          const event = new Event(filtered);
          this.event = event;
          this.eventSubject.next(event);
        });
    }
  }

  isSelectedEventCurrent(): boolean {
    if (this.event === undefined) { return false; }
    const latest = this.events[this.events.length - 1];
    return latest.id === this.event.id;
  }

}
