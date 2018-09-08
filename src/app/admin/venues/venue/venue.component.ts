import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
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
export class VenueComponent implements OnInit, OnDestroy {

  private venueSubscription: Subscription;
  private newStandSubscription: Subscription;

  private venue: Venue;
  @Input() canBeEdited: boolean;

  private loadingSrc: String = 'assets/img/loading.gif';
  private newStand: Stand;

  private confirmStand: boolean;
  private lockedStands: boolean;
  private pendingDeletion = false;

  constructor(
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.lockedStands = true;
    this.confirmStand = undefined;

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

  ngOnDestroy() {
    this.newStandSubscription.unsubscribe();
    this.venueSubscription.unsubscribe();
    this.canvasService.clear();
    this.canvasService.off();
  }

  alternateLock() {
    this.pendingDeletion = false;
    this.lockedStands = !this.lockedStands;
  }

  alternatePendingDeletion() {
    this.pendingDeletion = !this.pendingDeletion;
  }

  clickStand(id: number) {
    if (this.pendingDeletion) { this.deleteStand(id); }
  }

  deleteStand(id: number) {
    this.lockedStands = true;
    this.pendingDeletion = false;
    this.venuesService.deleteStand(id).subscribe(venue => {
      this.venuesService.setVenue(venue);
    });
  }

  selectStand(stand: Stand) {
    if (this.pendingDeletion) {
      this.canvasService.selectToDelete(stand);
    } else {
      this.canvasService.select(stand);
    }
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
    this.canvasService.clear();
    this.canvasService.revert();
    this.canvasService.off();
  }

  uploadStand() {
    const stand = this.newStand;

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
