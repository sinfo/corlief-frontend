import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs';

import { VenuesService } from 'src/app/admin/venues/venues.service';

import { CanvasState, CanvasCommunication } from './canvas/canvasCommunication';
import { Venue } from './venue';
import { Stand } from './stand';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

  venueSubscription: Subscription;
  venue: Venue;
  @Input() canBeEdited: boolean;

  loadingSrc: String = 'assets/img/loading.gif';
  confirmStand: boolean;
  newStand: Stand;

  private canvasCommunicationSubject: Subject<CanvasCommunication> = new Subject<CanvasCommunication>();

  constructor(private venuesService: VenuesService) { }

  ngOnInit() {
    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.venue = venue);
  }

  canvasStateSetup() {
    this.canvasCommunicationSubject.next(this.buildCanvasCommunication(CanvasState.SETUP));
  }

  canvasStateOn() {
    this.canvasCommunicationSubject.next(this.buildCanvasCommunication(CanvasState.ON));
  }

  canvasStateOff() {
    this.canvasCommunicationSubject.next(this.buildCanvasCommunication(CanvasState.OFF));
  }

  canvasStateRevert(selectedStand?: number) {
    this.canvasCommunicationSubject.next(this.buildCanvasCommunication(CanvasState.REVERT, selectedStand));
  }

  canvasStateClear() {
    this.canvasCommunicationSubject.next(this.buildCanvasCommunication(CanvasState.CLEAR));
  }

  buildCanvasCommunication(state: CanvasState, selectedStand?: number) {
    return selectedStand !== undefined
      ? new CanvasCommunication(state, selectedStand)
      : new CanvasCommunication(state);
  }

  selectStand(id: number) {
    this.canvasStateRevert(id);
  }

  deselectStand(id: number) {
    this.canvasStateRevert();
  }

  onUpdateVenue(venue: Venue) {
    this.venue = venue;
    this.canvasStateClear();
  }

  addStand() {
    this.canvasStateOn();
    this.confirmStand = false;
  }

  onNewStand(stand: Stand) {
    this.confirmStand = true;
    this.newStand = stand;
  }

  uploadStand() {
    this.confirmStand = undefined;
    this.canvasStateOff();
    this.venuesService.uploadStand(this.newStand).subscribe(
      (venue: Venue) => {
        this.venuesService.setVenue(venue);
        this.venue = venue;
        this.confirmStand = undefined;
        this.canvasStateRevert();
      },
      error => {
        if (error.status === 422) {
          console.error('Bad data', error);
        } else if (error.status === 401) {
          console.error('Unauthorized', error);
        } else {
          console.error(error);
        }
      }
    );
  }

}
