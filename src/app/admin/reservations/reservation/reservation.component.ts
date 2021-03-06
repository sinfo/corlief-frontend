import { Component, OnInit, Input } from '@angular/core';
import { Reservation } from './reservation';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Venue } from '../../venues/venue/venue';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  @Input() reservation: Reservation;
  @Input() adminMode: boolean;
  @Input() confirmationBlocked: boolean;
  @Input() venue: Venue;

  private loadingSrc = 'assets/img/loading.gif';
  private maxWidth: '10';

  constructor(
    private reservationsService: ReservationsService,
    private modalService: NgbModal
  ) { }

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

  remove(warningWindow) {
    this.reservationsService.remove(this.reservation.companyId, this.reservation.id)
      .subscribe(reservation => {
        this.reservationsService.getFromEdition(reservation.edition)
          .subscribe(allReservations => this.reservationsService.setReservations(allReservations));
        warningWindow.close();
      });
  }

  removeWarning(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
      });
  }

}
