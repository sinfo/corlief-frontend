import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';

import { Company, Companies } from './link/company';
import { Event } from '../event/event';
import { Link } from 'src/app/admin/links/link/link';

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

  constructor(
    private eventService: EventService,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    this.companies = new Companies();

    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => this.event = event);

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => {
        this.companies = companies;
        console.log(this.companies);
      });
  }

  ngOnDestroy() {
    this.companiesSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }

  invalidate(link: Link) {
    const company = this.companies.withLink.valid
      .filter(c => c.id !== link.companyId)[0];

    this.companies.withLink.valid = this.companies.withLink.valid
      .filter(c => company.id !== company.id) as [Company];

    this.companies.withLink.invalid.push(company);
  }

}
