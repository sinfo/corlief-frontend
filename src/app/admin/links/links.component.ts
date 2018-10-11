import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';

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
        if (companies) {
          this.companies = companies;
        }
      });
  }

  ngOnDestroy() {
    this.companiesSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }

}
