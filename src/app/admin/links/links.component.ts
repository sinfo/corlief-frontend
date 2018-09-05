import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';

import { Link } from './link/link';
import { Company } from './link/company';
import { Event } from '../event/event';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit, OnDestroy {

  event: Event;
  links: [Link];
  companies: {
    all: [Company],
    withLink: {
      valid: [Company],
      invalid: [Company]
    },
    withoutLink: [Company]
  };

  eventSubscription: Subscription;
  companiesSubscription: Subscription;
  linksSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    this.companies = {
      all: <[Company]>[],
      withLink: {
        valid: <[Company]>[],
        invalid: <[Company]>[]
      },
      withoutLink: <[Company]>[]
    };

    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        if (event) {
          this.event = event;
        }
      });

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => {
        if (companies) {
          this.companies.all = companies;
          this.updateCompanies();
        }
      });

    this.linksSubscription = this.linksService.getLinksSubscription()
      .subscribe(links => {
        if (links) {
          this.links = links;
          this.updateCompanies();
        }
      });
  }

  ngOnDestroy() {
    this.companiesSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
    this.linksSubscription.unsubscribe();
  }

  getLinks(edition: String) {
    this.linksService.getLinks({ edition: <string>edition })
      .subscribe(links => {
        this.links = links instanceof Link ? [links] : links;

        if (this.companies && this.companies.all && this.links) {
          this.companies.withLink = Company.fillLinks(this.companies.all, this.links);
        }
      });
  }

  updateCompanies() {
    this.linksService.getCompaniesWithMissingLinks()
      .subscribe(companies => this.companies.withoutLink = companies);

    if (this.event) {
      this.getLinks(this.event.id);
    }
  }

}
