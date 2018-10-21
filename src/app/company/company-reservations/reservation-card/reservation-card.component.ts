import { Component, OnInit, Input } from '@angular/core';

import { Event } from 'src/app/deck/event';
import { Reservation } from 'src/app/admin/reservations/reservation/reservation';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.css']
})
export class ReservationCardComponent implements OnInit {

  @Input() reservation: Reservation;
  @Input() event: Event;

  status: String;

  constructor() { }

  ngOnInit() {
    this.status = this.reservation.feedback ? this.reservation.feedback.status : null;
  }

}
