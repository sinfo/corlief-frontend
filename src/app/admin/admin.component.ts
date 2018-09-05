import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { VenuesService } from './venues/venues.service';
import { LinksService } from './links/links.service';
import { EventService } from './event/event.service';

import { Event } from './event/event';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  eventSubscription: Subscription;
  event: Event;

  constructor(
    private eventService: EventService,
    private venuesService: VenuesService,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        if (event) {
          this.event = event;
        }
      });

    this.venuesService.getCurrentVenue().subscribe(venue => {
      this.venuesService.setVenue(venue);
      this.eventService.updateEvent(venue.edition);
      this.linksService.updateLinks(venue.edition as string);
    });
  }


  ngOnDestroy() {
  }

}
