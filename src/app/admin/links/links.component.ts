import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { LinksService } from 'src/app/admin/links/links.service';
import { VenuesService } from 'src/app/admin/venues/venues.service';

import { Link } from './link/link';
import { Company } from './link/company';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit, OnDestroy {

  edition: String;
  links: [Link];
  companies: [Company];
  companiesWithoutLink: [Company];

  venueSubscription: Subscription;
  companiesSubscription: Subscription;

  constructor(private venuesService: VenuesService, private linksService: LinksService) { }

  ngOnInit() {
    this.linksService.getCompaniesWithMissingLinks()
      .subscribe(companies => this.companiesWithoutLink = companies);

    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => {
        if (venue) {
          this.edition = venue.edition;
          this.getLinks(venue.edition);
        }
      });

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => this.companies = companies);

    if (this.venuesService.getVenue() === undefined) {
      this.getCurrent();
    }
  }

  ngOnDestroy() {
    this.venueSubscription.unsubscribe();
    this.companiesSubscription.unsubscribe();
  }

  getCurrent() {
    this.venuesService.getCurrentVenue().subscribe(
      venue => {
        this.venuesService.setVenue(venue);
      },
      error => {
        console.error(error);
      }
    );
  }

  getLinks(edition: String) {
    this.linksService.getLinks({ edition: <string>edition })
      .subscribe(links => {
        links = links instanceof Link ? [links] : links;
      });
  }

}
