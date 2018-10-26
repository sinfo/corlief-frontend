import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { CompanyService } from 'src/app/company/company.service';
import { EventService } from 'src/app/admin/event/event.service';

import { Credentials } from '../credentials';
import { Event } from 'src/app/admin/event/event';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  private credentials: Credentials;

  private event: Event;
  private eventSubscription: Subscription;

  constructor(
    private companyService: CompanyService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.credentials = this.companyService.getCredentials();

    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        this.event = event;
        console.log(event);
      });
  }

}
