import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { CompanyService } from '../company.service';
import { VenuesService } from '../../admin/venues/venues.service';
import { DeckService } from 'src/app/services/deck.service';
import { CanvasService } from '../../admin/venues/venue/venue-image/canvas/canvas.service';
import { ReservationsService } from 'src/app/views/admin/reservations/reservations.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Credentials } from '../../../models/credentials';
import { Availability } from '../../admin/venues/venue/venue';
import { Event } from 'src/app/models/event';
import { Stand } from '../../admin/venues/venue/stand';
import { Reservation, Stand as ReservationStand } from '../../admin/reservations/reservation/reservation';
import { CanvasState } from 'src/app/views/admin/venues/venue/venue-image/canvas/canvasCommunication';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-reservations',
  templateUrl: './company-reservations.component.html',
  styleUrls: ['./company-reservations.component.css']
})
export class CompanyReservationsComponent implements OnInit, OnDestroy {

  private canvasState: CanvasState = CanvasState.COMPANY_RESERVATIONS;

  private eventSubscription: Subscription;
  private translateSubscription: Subscription;

  event: Event;
  availability: Availability;
  private credentials: Credentials;
  private english: boolean;

  private selectedDay: { day: number, date: Date, allDays: number[] };

  private reservations: Reservation[];
  private latestReservation: Reservation;

  private showAllReservations: boolean;


  constructor(
    private companyService: CompanyService,
    private deckService: DeckService,
    private venuesService: VenuesService,
    private canvasService: CanvasService,
    private reservationService: ReservationsService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
    this.credentials = this.companyService.getCredentials();
    this.showAllReservations = false;

    this.updateReservations();

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        const days = [];
        for (let i = 1; i <= event.getDuration(); i++) { days.push(i); }

        this.event = event;
        this.selectedDay = { day: 1, date: event.date, allDays: days };
      });

    this.companyService.getVenueAvailability().subscribe(_availability => {
      const availability = new Availability(_availability);
      this.availability = availability;

      this.venuesService.setVenue(availability.venue);
      this.deckService.updateEvent(availability.venue.edition);
      this.venuesService.setAvailability(availability);
      this.canvasService.selectDay(1);
      this.english = this.translate.getDefaultLang() === 'en';
    });
  }

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.english = !this.english;
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.translateSubscription.unsubscribe();
  }

  public clickStandFromCanvas(stand) {
    this.clickStand(stand.id, this.isFreeStand(stand.id));
  }

  private updateReservations() {
    this.companyService.getReservations(false).subscribe(r => {
      this.reservations = Reservation.fromArray(r);

      this.companyService.getReservations(true).subscribe(reservations => {
        if (!reservations.length) {
          this.latestReservation = new Reservation();
          return;
        }

        const latest = reservations[0];
        const status = latest.feedback.status;

        if (status !== 'CANCELLED') {
          this.latestReservation = new Reservation(reservations[0]);

          this.reservations = this.reservations.filter(
            reservation => reservation.id !== latest.id
          ) as Reservation[];

          this.reservationService.setReservation(latest);
        } else {
          this.latestReservation = new Reservation();
        }
      });
    });

  }

  private changeDay(day: number) {
    if (day < 1 || day > this.event.getDuration()) { return; }

    this.canvasService.selectDay(day);

    const newDate = new Date(this.selectedDay.date.getTime());
    const diff = day - this.selectedDay.day;
    newDate.setDate(this.selectedDay.date.getDate() + diff);

    this.selectedDay.date = newDate;
    this.selectedDay.day = day;
  }

  private selectStand(stand: Stand) {
    this.canvasService.select(stand);
  }

  // TODO is id necessary
  private deselectStand(id: number) {
    this.canvasService.revert();
  }

  private clickableStand(standId) {
    return this.latestReservation && this.latestReservation.issued === undefined
      && !this.isOccupiedStand(standId)
      && this.latestReservation.stands.length < this.credentials.participationDays;
  }

  private clickStand(standId: number, free: boolean) {
    if (free) {
      const stand = new ReservationStand(this.selectedDay.day, standId);
      this.latestReservation.update(this.credentials.participationDays, stand);
      this.reservationService.setReservation(this.latestReservation);
    }
  }

  removePendingStand(stand: { day: number, id: number }) {
    const s = new ReservationStand(stand.day, stand.id);
    this.latestReservation.update(this.credentials.participationDays, s);
    this.reservationService.setReservation(this.latestReservation);
  }

  private isFreeStand(standId: number): boolean {
    return !this.isConfirmedBook(standId)
      && !this.isPendingBook(standId)
      && this.availability.isFree(this.selectedDay.day, standId);
  }

  private isOccupiedStand(standId: number): boolean {
    return !this.isConfirmedBook(standId)
      && !this.isPendingBook(standId)
      && !this.availability.isFree(this.selectedDay.day, standId);
  }

  private isPendingBook(standId: number) {
    const stand = new ReservationStand(this.selectedDay.day, standId);
    return !this.isConfirmedBook(standId) && this.latestReservation
      ? this.latestReservation.hasStand(stand) : false;
  }

  private isConfirmedBook(standId: number) {
    const stand = new ReservationStand(this.selectedDay.day, standId);
    return this.latestReservation
      ? this.latestReservation.hasStand(stand) && this.latestReservation.isConfirmed()
      : false;
  }

  private makeReservation(content) {
    const contiguous: boolean = this.latestReservation.daysAreContiguous();
    const same_stand: boolean = this.latestReservation.standIsSame();
    if (!(contiguous && same_stand)) {
      this.popupConfirmSubmission(content);
    } else {
      this.commitReservation();
    }
  }

  private popupConfirmSubmission(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      const closeResult = `${result}`;
      if (closeResult === 'Confirmed') {
        this.commitReservation();
      }
    });
  }

  private commitReservation() {
    this.companyService.makeReservation(this.latestReservation)
      .subscribe(_reservation => {
        const reservation = new Reservation(_reservation);
        this.updateReservations();
        this.reservationService.setReservation(reservation);
      });
  }

  private cancelReservation() {
    this.companyService.cancelReservation()
      .subscribe(_reservation => {
        this.updateReservations();
        this.reservationService.setReservation(undefined);
      });
  }

  private alternateShowAllReservations() {
    this.showAllReservations = !this.showAllReservations;
  }

}
