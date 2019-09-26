import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subscription } from 'rxjs/internal/Subscription';

import { environment } from 'src/environments/environment';

import { VenuesService } from '../views/admin/venues/venues.service';
import { StorageService } from '../storage.service';

import { Event } from '../models/event';
import { Company } from '../models/company';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  public events: [Event];
  public event: Event;

  private deck = `${environment.deck}`;

  private eventSubject: ReplaySubject<Event> = new ReplaySubject<Event>();
  private deckCompaniesSubject: ReplaySubject<Company[]> = new ReplaySubject<Company[]>();

  private venueSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private venues: VenuesService,
    private storage: StorageService,
    private authService: AuthService
  ) {

    this.venueSubscription = this.venues.getVenueSubject()
      .subscribe(venue => {
        if (venue) {
          this.updateEvent(venue.edition);
          this.getCompanies(venue.edition);
        }
      });
  }

  private getCompanies(edition: String): void {
    this.http.get<Company[]>(
      `${this.deck}/companies?event=${edition}`,
      { withCredentials: true }
    ).subscribe(companies => this.deckCompaniesSubject.next(companies));
  }

  getEventSubject(): Observable<Event> {
    return this.eventSubject.asObservable();
  }

  getDeckCompaniesSubject(): Observable<Company[]> {
    return this.deckCompaniesSubject.asObservable();
  }

  updateEvent(edition?: String) {
    if (this.event && edition && this.event.id === edition) { return; }

    if (this.authService.isLoggedIn()) {
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
