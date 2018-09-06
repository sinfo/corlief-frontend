import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { EventService } from 'src/app/admin/event/event.service';
import { LinksService } from 'src/app/admin/links/links.service';

import { Company, Companies } from '../links/link/company';
import { Event } from '../event/event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private companies: Companies;
  private companiesSubscription: Subscription;

  private errorSrc = 'assets/img/hacky.png';
  private loadingSrc = 'assets/img/loading.gif';

  constructor(private linksService: LinksService) { }

  ngOnInit() {
    this.companies = new Companies();

    this.companiesSubscription = this.linksService.getCompaniesSubscription()
      .subscribe(companies => {
        if (companies) {
          this.companies = companies;
        }
      });
  }

  ngOnDestroy() {
    this.companiesSubscription.unsubscribe();
  }
}
