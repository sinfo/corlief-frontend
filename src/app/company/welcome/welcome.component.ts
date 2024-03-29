import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { CompanyService } from 'src/app/company/company.service';
import { DeckService } from 'src/app/deck/deck.service';

import { Credentials } from '../credentials';
import { Event } from 'src/app/deck/event';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private deckService: DeckService,
    private translate: TranslateService) {
    this.english = this.translate.getDefaultLang() === 'en';
  }

  credentials: Credentials;

  event: Event;
  private eventSubscription: Subscription;
  private page: number;
  private english: boolean;
  private step: String;


  ngOnInit() {
    this.credentials = this.companyService.getCredentials();
    this.page = 0;

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        this.event = event;
      });

    this.companyService.getCompanyStep().subscribe(step => { 
      this.step = step.step; 
    });

    this.translate.onLangChange.subscribe(LangChangeEvent => {
      this.english = LangChangeEvent.lang === 'en';
    });
  }

  currentStep() {
    return this.step;
  }

  next() {
    this.page === 2 ? this.page = 0 : this.page++;
  }

  back() {
    if (this.page !== 0) {
      this.page--;
    }
  }
}
