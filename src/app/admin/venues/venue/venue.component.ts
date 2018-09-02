import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs';

import { VenuesService } from 'src/app/admin/venues/venues.service';

import { CanvasState, CanvasCommunication } from './venue-image/canvas/canvasCommunication';
import { Venue } from './venue';
import { Stand } from './stand';
import { CanvasService } from 'src/app/admin/venues/venue/venue-image/canvas/canvas.service';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

  venueSubscription: Subscription;
  newStandSubscription: Subscription;

  venue: Venue;
  @Input() canBeEdited: boolean;

  loadingSrc: String = 'assets/img/loading.gif';
  newStand: Stand;

  confirmStand: boolean;
  lockedStands: boolean;

  constructor(
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.lockedStands = true;

    this.newStandSubscription = this.canvasService.getNewStandSubject()
      .subscribe(stand => {
        if (stand) {
          this.confirmStand = true;
          this.newStand = stand;
        }
      });

    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.venue = venue);
  }

  alternateLock() {
    this.lockedStands = !this.lockedStands;
  }

  deleteStand(id: number) {
    this.lockedStands = true;
    this.venuesService.deleteStand(id).subscribe(venue => {
      this.venuesService.setVenue(venue);
    });
  }

  selectStand(id: number) {
    this.canvasService.revert(id);
  }

  deselectStand(id: number) {
    this.canvasService.revert();
  }

  onUpdateVenue(venue: Venue) {
    this.venue = venue;
    this.canvasService.clear();
  }

  newStandPreparations() {
    this.canvasService.on();
    this.confirmStand = false;
  }

  cancelStand() {
    this.confirmStand = undefined;
    this.canvasService.revert();
    this.canvasService.off();
  }

  uploadStand() {
    const stand = this.newStand;
    this.confirmStand = undefined;

    this.canvasService.off();
    this.venuesService.uploadStand(stand).subscribe(
      (venue: Venue) => {
        this.venuesService.setVenue(venue);
        this.venue = venue;
        this.confirmStand = undefined;
        this.canvasService.revert();
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
