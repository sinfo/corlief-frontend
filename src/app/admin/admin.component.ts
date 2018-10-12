import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { VenuesService } from './venues/venues.service';
import { LinksService } from './links/links.service';
import { EventService } from './event/event.service';

import { Event } from './event/event';
import { Venue } from 'src/app/admin/venues/venue/venue';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  private eventSubscription: Subscription;
  private event: Event;
  private events: [Event];
  private venue: Venue;

  constructor(
    private eventService: EventService,
    private venuesService: VenuesService,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    this.venuesService.getVenue().subscribe(
      venue => this.updateData(venue),
      error => this.eventService.updateEvent()
    );

    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        if (this.event === undefined || this.event.id !== event.id) {
          this.event = event;
          this.events = this.eventService.events;

          this.venuesService.getVenue(event.id).subscribe(
            venue => this.updateData(venue),
            error => this.updateData(null)
          );
        }
      });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  private switchEvent(edition: string) {
    this.eventService.updateEvent(edition);
  }

  private updateData(venue: Venue) {
    this.venue = venue;
    this.venuesService.setVenue(venue);

    if (venue !== null) {
      this.eventService.updateEvent(venue.edition);
    }
  }

}
