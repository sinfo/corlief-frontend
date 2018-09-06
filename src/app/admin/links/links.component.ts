import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';

import { Link } from './link/link';
import { Company, Companies } from './link/company';
import { Event } from '../event/event';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit, OnDestroy {

  event: Event;
  companies: Companies;

  eventSubscription: Subscription;
  companiesSubscription: Subscription;
  linksSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    this.companies = new Companies();

    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        if (event) {
          this.event = event;
        }
      });

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => {
        if (companies && this.event) {
          this.companies.updateCompanies(companies, this.event.id);
          this.getLinks(this.event.id);
        }
      });

    this.linksSubscription = this.linksService.getLinksSubscription()
      .subscribe(links => {
        if (links) {
          this.companies.updateLinks(links);
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
        const l = links instanceof Link ? [links] as [Link] : links as [Link];
        this.companies.updateLinks(l);
      });
  }

}
