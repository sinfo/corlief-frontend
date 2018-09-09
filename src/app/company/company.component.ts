import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

import { CompanyService } from './company.service';
import { VenuesService } from '../admin/venues/venues.service';
import { EventService } from '../admin/event/event.service';
import { CanvasService } from '../admin/venues/venue/venue-image/canvas/canvas.service';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';

import { Credentials } from './credentials';
import { Availability } from '../admin/venues/venue/venue';
import { Event } from '../admin/event/event';
import { Venue } from '../admin/venues/venue/venue';
import { Stand } from '../admin/venues/venue/stand';
import { Reservation, Stand as ReservationStand } from '../admin/reservations/reservation/reservation';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy {

  private eventSubscription: Subscription;

  private event: Event;
  private availability: Availability;
  private credentials: Credentials;

  private day = 1;
  private reservations: {
    pending: Reservation,
    done: Reservation
  };

  constructor(
    private companyService: CompanyService,
    private eventService: EventService,
    private venuesService: VenuesService,
    private canvasService: CanvasService,
    private pagination: NgbPaginationConfig,
    private reservationService: ReservationsService
  ) { }

  ngOnInit() {
    this.credentials = this.companyService.getCredentials();
    this.reservations = {
      pending: new Reservation(),
      done: undefined
    };

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
    const stand = new ReservationStand(day, standId);
    this.reservations.pending.update(this.credentials.participationDays, stand);
    this.reservationService.setReservation(this.reservations.pending);
  }

  private isPendingBook(day: number, standId: number) {
    const stand = new ReservationStand(day, standId);
    return this.reservations.pending.hasStand(stand);
  }

}
