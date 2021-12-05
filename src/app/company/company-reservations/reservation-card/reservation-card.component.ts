import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Event } from 'src/app/deck/event';
import { Activity, Reservation } from 'src/app/admin/reservations/reservation/reservation';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Venue } from 'src/app/admin/venues/venue/venue';
import { Credentials } from '../../credentials';


@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.css']
})
export class ReservationCardComponent implements OnInit {

  @Input() reservation: Reservation;
  @Input() event: Event;
  @Input() venue: Venue;
  @Input() credentials: Credentials;
  @Output() removeStandEvent = new EventEmitter<{ day: number, id: number }>();
  // TODO: Adapt to activities
  @Output() removeWorkshopEvent = new EventEmitter<any>();
  @Output() removePresentationEvent = new EventEmitter<any>();
  @Output() removeLunchTalkEvent = new EventEmitter<any>();
  @Output() removeActivityEvent = new EventEmitter<Activity>();


  private english: boolean;
  private translateSubscription: Subscription;
  private limitedStands: boolean;

  status: String;

  constructor(
    private translate: TranslateService
  ) {
    this.english = this.translate.currentLang === 'en';
  }

  ngOnInit() {
    this.status = this.reservation.feedback ? this.reservation.feedback.status : null;
    this.translateSubscription = this.translate.onLangChange.subscribe(LangChangeEvent => {
      this.english = !this.english;
    });
    this.limitedStands = this.venue.stands.length !== 0;
  }

  removeStand(stand: { day: number, id: number }) {
    this.removeStandEvent.emit(stand);
  }

  removeActivity(act: Activity) {
    this.removeActivityEvent.emit(act);
  }

  hasActivity(activity) {
    return this.reservation.activities.some(x => x.kind === activity && x.id !== undefined);
  }

  getActivity(activity) {

    return this.reservation.activities.find(x => x.kind === activity && x.id !== undefined);
  }
}
