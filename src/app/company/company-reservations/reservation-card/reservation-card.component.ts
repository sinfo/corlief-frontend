import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Event } from 'src/app/deck/event';
import { Reservation } from 'src/app/admin/reservations/reservation/reservation';
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

  private english: boolean;
  private translateSubscription: Subscription;

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
  }

  removeStand(stand: { day: number, id: number }) {
    this.removeStandEvent.emit(stand);
  }

}
