import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { DeckService } from 'src/app/deck/deck.service';
import { LinksService } from 'src/app/admin/links/links.service';
import { VenuesService } from 'src/app/admin/venues/venues.service';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';

import { Companies } from '../links/link/companies';
import { Event } from 'src/app/deck/event';
import { Venue } from 'src/app/admin/venues/venue/venue';
import { Reservation } from 'src/app/admin/reservations/reservation/reservation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private reservationsFromAPI: [Reservation];

  venue: Venue;
  companies: Companies;
  reservations: {
    all: [Reservation],
    pending: [Reservation],
    confirmed: [Reservation],
    cancelled: [Reservation]
  };

  private eventSubscription: Subscription;
  private companiesSubscription: Subscription;
  private venueSubscription: Subscription;
  private reservationsSubscription: Subscription;

  private errorSrc = 'assets/img/hacky.png';
  private loadingSrc = 'assets/img/loading.gif';

  constructor(
    private deckService: DeckService,
    private linksService: LinksService,
    private venuesService: VenuesService,
    private reservationsService: ReservationsService
  ) { }

  ngOnInit() {
    this.companies = new Companies();

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        this.reservationsService.getFromEdition(event.id)
          .subscribe(reservations => this.reservationsService.setReservations(reservations));
      });

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => {
        this.companies = companies;
        this.updateReservations();
      });

    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.venue = venue);

    this.reservationsSubscription = this.reservationsService.getReservationsSubject()
      .subscribe(_reservations => {
        this.reservationsFromAPI = _reservations;
        this.updateReservations();
      });
  }

  private updateReservations() {
    if (this.reservations !== undefined
      || !this.companies.all.length
      || this.reservationsFromAPI === undefined) {
      return;
    }

    const reservations = this.companies
      ? Reservation.fromArray(this.reservationsFromAPI, this.companies.all)
      : Reservation.fromArray(this.reservationsFromAPI);

    this.reservations = {
      all: reservations,
      pending: reservations.filter(r => r.isPending()) as [Reservation],
      confirmed: reservations.filter(r => r.isConfirmed()) as [Reservation],
      cancelled: reservations.filter(r => r.isCancelled()) as [Reservation]
    };
  }

  ngOnDestroy() {
    this.companiesSubscription.unsubscribe();
    this.venueSubscription.unsubscribe();
    this.reservationsSubscription.unsubscribe();
  }
}
