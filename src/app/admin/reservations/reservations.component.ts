import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { VenuesService } from 'src/app/admin/venues/venues.service';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';
import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';

import { Reservation } from 'src/app/admin/reservations/reservation/reservation';
import { Event } from '../event/event';
import { Company, Companies } from 'src/app/admin/links/link/company';
import { Venue, Availability } from 'src/app/admin/venues/venue/venue';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  private event: Event;
  private reservations: [Reservation];
  private companies: [Company];
  private venue: Venue;
  private availability: Availability;

  private eventSubscription: Subscription;
  private companiesSubscription: Subscription;
  private venuesSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private reservationsService: ReservationsService,
    private linksService: LinksService,
    private venuesService: VenuesService
  ) { }

  ngOnInit() {

    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        if (event) {
          this.event = event;

          if (this.availability === undefined && this.event && this.venue && this.reservations && this.companies) {
            this.availability = Availability.generate(this.event, this.venue, this.reservations, this.companies);
          }
        }
      });

    this.venuesSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => {
        if (venue) {
          this.venue = venue;

          if (this.availability === undefined && this.event && this.venue && this.reservations && this.companies) {
            this.availability = Availability.generate(this.event, this.venue, this.reservations, this.companies);
          }
        }
      });

    this.venuesService.getVenue().subscribe(venue => {
      this.venuesService.setVenue(venue);
    });


    this.reservationsService.getLatest().subscribe(reservations => {
      this.reservations = Reservation.fromArray(reservations);
    });

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => {
        if (companies && companies.all.length > 0) {
          this.companies = companies.all;

          if (this.availability === undefined && this.event && this.venue && this.reservations && this.companies) {
            this.availability = Availability.generate(this.event, this.venue, this.reservations, this.companies);
          }
        }
      });
  }

}
