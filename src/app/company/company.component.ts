import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

import { CompanyService } from './company.service';
import { VenuesService } from '../admin/venues/venues.service';
import { EventService } from '../admin/event/event.service';
import { CanvasService } from '../admin/venues/venue/venue-image/canvas/canvas.service';

import { Availability } from '../admin/venues/venue/venue';
import { Event } from '../admin/event/event';
import { Venue } from '../admin/venues/venue/venue';
import { Stand } from '../admin/venues/venue/stand';
import { Stand as ReservationStand, Reservation } from '../admin/reservations/reservation/reservation';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy {

  private eventSubscription: Subscription;

  private event: Event;
  private availability: Availability;

  private day = 1;
  private pendingReservations = [] as [ReservationStand];

  constructor(
    private companyService: CompanyService,
    private eventService: EventService,
    private venuesService: VenuesService,
    private canvasService: CanvasService,
    private pagination: NgbPaginationConfig
  ) { }

  ngOnInit() {
    this.eventSubscription = this.eventService.getEventSubject().subscribe(event => {
      if (event) {
        this.event = event;
      }
    });

    this.companyService.getVenueAvailability().subscribe(_availability => {
      const availability = new Availability(_availability);
      this.availability = availability;

      this.venuesService.setVenue(availability.venue);
      this.eventService.updateEvent(availability.venue.edition);
      this.venuesService.setAvailability(availability);
      this.canvasService.selectDay(1);
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  private changeDay(day: number) {
    this.canvasService.selectDay(day);
  }

  private selectStand(stand: Stand) {
    this.canvasService.select(stand);
  }

  private deselectStand(id: number) {
    this.canvasService.revert();
  }

  private clickStand(day: number, standId: number) {
    const isPending = this.isPendingBook(day, standId);

    if (isPending) {
      this.pendingReservations = ReservationStand.removeStand(
        this.pendingReservations, day, standId
      );
    } else {
      const stand = new ReservationStand(day, standId);
      this.pendingReservations.push(stand);
    }

    console.log('pending', this.pendingReservations);
  }

  private isPendingBook(day: number, standId: number) {
    return ReservationStand.hasStand(this.pendingReservations, day, standId);
  }

}
