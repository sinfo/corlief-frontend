import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { EventService } from './event/event.service';
import { Event } from './event/event';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  eventSubscription: Subscription;
  event: Event;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventSubscription = this.eventService.getEventSubject()
      .subscribe(event => {
        if (event) {
          this.event = event;
        }
      });
  }

  ngOnDestroy() {
  }

}
