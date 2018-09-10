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
  private reservations: [Reservation];
  private pendingReservation: Reservation;
  private latestReservation: Reservation;

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

    this.updateReservations();

    this.eventSubscription = this.eventService.getEventSubject().subscribe(event => {
      this.event = event;
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

  private updateReservations() {
    this.companyService.getReservations(false).subscribe(reservations => {
      this.reservations = Reservation.fromArray(reservations);
    });

    this.companyService.getReservations(true).subscribe(reservations => {
      if (!reservations.length || reservations[0].feedback.status === 'CANCELLED') {
        this.pendingReservation = new Reservation();
      } else if (reservations[0].feedback.status !== 'CANCELLED') {

        this.pendingReservation = new Reservation(reservations[0]);
        this.latestReservation = new Reservation(reservations[0]);

        this.reservations = this.reservations.filter(
          reservation => reservation.id !== reservations[0].id
        ) as [Reservation];
        this.reservationService.setReservation(reservations[0]);
      }
    });
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

  private clickableStand(day, standId) {
    return this.pendingReservation && this.pendingReservation.issued === undefined
      && !this.isOccupiedStand(day, standId);
  }

  private clickStand(day: number, standId: number) {
    if (this.pendingReservation
      && this.pendingReservation.issued === undefined
      && !this.isOccupiedStand(day, standId)
    ) {
      const stand = new ReservationStand(day, standId);
      this.pendingReservation.update(this.credentials.participationDays, stand);
      this.reservationService.setReservation(this.pendingReservation);
    }
  }

  private isFreeStand(day: number, standId: number): boolean {
    return !this.isConfirmedBook(day, standId)
      && !this.isPendingBook(day, standId)
      && this.availability.isFree(day, standId);
  }

  private isOccupiedStand(day: number, standId: number): boolean {
    return !this.isConfirmedBook(day, standId)
      && !this.isPendingBook(day, standId)
      && !this.availability.isFree(day, standId);
  }

  private isPendingBook(day: number, standId: number) {
    const stand = new ReservationStand(day, standId);
    return !this.isConfirmedBook(day, standId) && this.pendingReservation
      ? this.pendingReservation.hasStand(stand) : false;
  }

  private isConfirmedBook(day: number, standId: number) {
    const stand = new ReservationStand(day, standId);
    return this.latestReservation
      ? this.latestReservation.hasStand(stand) && this.latestReservation.isConfirmed()
      : false;
  }

  private makeReservation() {
    this.companyService.makeReservation(this.pendingReservation)
      .subscribe(_reservation => {
        const reservation = new Reservation(_reservation);
        this.updateReservations();
        this.reservationService.setReservation(reservation);
      });
  }

  private cancelReservation() {
    this.companyService.cancelReservation()
      .subscribe(_reservation => {
        this.updateReservations();
        this.reservationService.setReservation(undefined);
      });
  }
}
