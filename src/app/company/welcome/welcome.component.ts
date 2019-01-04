import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { CompanyService } from 'src/app/company/company.service';
import { DeckService } from 'src/app/deck/deck.service';

import { Credentials } from '../credentials';
import { Event } from 'src/app/deck/event';

import {TranslateService} from '@ngx-translate/core';

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
      translate.setDefaultLang('en');
  }

  credentials: Credentials;

  event: Event;
  private eventSubscription: Subscription;
  private page: number;
  private english: boolean;


  ngOnInit() {
    this.credentials = this.companyService.getCredentials();
    this.page = 0;
    this.english = true;

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        this.event = event;
        console.log(event);
      });
  }

  next() {
    this.page === 2 ? this.page = 0 : this.page++;
  }

  back() {
    if (this.page !== 0) {
      this.page--;
    }
  }
  
  lang(){
    if(this.english){
      this.translate.use('pt');
    }
    else{
      this.translate.use('en');
    }
    this.english = !this.english;
  }
  
}
