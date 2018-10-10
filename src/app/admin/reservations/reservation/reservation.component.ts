import { Component, OnInit, Input } from '@angular/core';
import { Reservation } from './reservation';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  @Input() reservation: Reservation;
  @Input() adminMode: boolean;
  @Input() confirmationBlocked: boolean;

  constructor(private reservationsService: ReservationsService) { }

  ngOnInit() {
  }

  confirm() {
    if (!this.adminMode) { return; }

    this.reservationsService.confirm(this.reservation.companyId)
      .subscribe(reservation => this.reservationsService.updateWithLatest());
  }

  cancel() {
    this.reservationsService.cancel(this.reservation.companyId)
      .subscribe(reservation => this.reservationsService.updateWithLatest());
  }

}
