import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { VenuesService } from 'src/app/admin/venues/venues.service';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';
import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';
import { CanvasService } from 'src/app/admin/venues/venue/venue-image/canvas/canvas.service';

import { Reservation } from 'src/app/admin/reservations/reservation/reservation';
import { Event } from '../event/event';
import { Company, Companies } from 'src/app/admin/links/link/company';
import { Venue, Availability } from 'src/app/admin/venues/venue/venue';
import { CanvasState } from 'src/app/admin/venues/venue/venue-image/canvas/canvasCommunication';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  private canvasState: CanvasState = CanvasState.RESERVATIONS;

  private event: Event;
  private reservations: {
    all: [Reservation],
    confirmed: [Reservation],
    pending: [Reservation]
  };
  private companies: [Company];
  private venue: Venue;
  private availability: Availability;
  private day = 1;

  private eventSubscription: Subscription;
  private companiesSubscription: Subscription;
  private venuesSubscription: Subscription;
  private availabilitySubscription: Subscription;
  private reservationsSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private reservationsService: ReservationsService,
    private linksService: LinksService,
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.reservations = {
      all: [] as [Reservation],
      confirmed: [] as [Reservation],
      pending: [] as [Reservation]
    };

    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        if (event) {
          this.event = new Event(event);

          if (this.availability === undefined) {
            this.generateAvailability();
          }
        }
      });

    this.venuesSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => {
        if (venue) {
          this.venue = venue;

          if (this.availability === undefined) {
            this.generateAvailability();
          }
        }
      });

    this.venuesService.getVenue().subscribe(venue => {
      this.venuesService.setVenue(venue);
    });

    this.reservationsSubscription = this.reservationsService.getReservationsSubject()
      .subscribe(_reservations => {
        if (_reservations) {
          const reservations = this.companies
            ? Reservation.fromArray(_reservations, this.companies)
            : Reservation.fromArray(_reservations);

          this.reservations = {
            all: reservations,
            pending: reservations.filter(r => r.isPending()) as [Reservation],
            confirmed: reservations.filter(r => r.isConfirmed()) as [Reservation]
          };

          this.generateAvailability();
        }
      });

    this.reservationsService.updateWithLatest();
    this.availability = this.venuesService.getAvailability();

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => {
        if (companies && companies.all.length > 0) {
          this.companies = companies.all;

          if (this.reservations.all.length && this.reservations.all[0].company === undefined) {
            Reservation.updateArrayWithCompanyInfo(this.reservations.all, companies.all);
            Reservation.updateArrayWithCompanyInfo(this.reservations.pending, companies.all);
            Reservation.updateArrayWithCompanyInfo(this.reservations.confirmed, companies.all);
          }

          if (this.availability === undefined) {
            this.generateAvailability();
          }
        }
      });
  }

  private generateAvailability() {
    if (this.event && this.venue && this.reservations && this.companies) {
      this.availability = Availability.generate(
        this.event, this.venue, this.reservations.all, this.companies
      );
      this.venuesService.setAvailability(this.availability);
      this.canvasService.selectDay(1);
    }
  }

  private changeDay(day: number) {
    this.canvasService.selectDay(day);
  }

  private confirmationBlocked(reservation: Reservation): boolean {
    return !reservation.canbeConfirmed(this.reservations.confirmed);
  }

}
