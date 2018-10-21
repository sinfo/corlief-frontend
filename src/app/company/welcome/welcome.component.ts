import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { CompanyService } from 'src/app/company/company.service';
import { DeckService } from 'src/app/deck/deck.service';

import { Credentials } from '../credentials';
import { Event } from 'src/app/deck/event';

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
    private deckService: DeckService
  ) { }

  ngOnInit() {
    this.credentials = this.companyService.getCredentials();

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        this.event = event;
        console.log(event);
      });
  }

}