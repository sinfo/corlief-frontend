import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';
import { VenuesService } from 'src/app/admin/venues/venues.service';

import { Company, Companies } from '../links/link/company';
import { Event } from '../event/event';
import { Venue } from 'src/app/admin/venues/venue/venue';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private companies: Companies;
  private venue: Venue;

  private companiesSubscription: Subscription;
  private venueSubscription: Subscription;

  private errorSrc = 'assets/img/hacky.png';
  private loadingSrc = 'assets/img/loading.gif';

  constructor(
    private linksService: LinksService,
    private venuesService: VenuesService
  ) { }

  ngOnInit() {
    this.companies = new Companies();

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => this.companies = companies);

    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.venue = venue);
  }

  ngOnDestroy() {
    this.companiesSubscription.unsubscribe();
  }
}
