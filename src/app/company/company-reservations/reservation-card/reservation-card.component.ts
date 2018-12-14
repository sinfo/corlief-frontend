import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() removeStandEvent = new EventEmitter<{ day: number, id: number }>();

  status: String;

  constructor() { }

  ngOnInit() {
    this.status = this.reservation.feedback ? this.reservation.feedback.status : null;
  }

  removeStand(stand: { day: number, id: number }) {
    this.removeStandEvent.emit(stand);
  }

}
