import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs';

import { VenuesService } from 'src/app/admin/venues/venues.service';
import { CanvasService } from 'src/app/admin/venues/venue/venue-image/canvas/canvas.service';
import { DeckService } from 'src/app/deck/deck.service';

import { CanvasState } from './venue-image/canvas/canvasCommunication';
import { Venue } from './venue';
import { Stand } from './stand';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit, OnDestroy {
  private canvasState: CanvasState = CanvasState.VENUE;

  private eventSubscription: Subscription;
  private venueSubscription: Subscription;
  private newStandSubscription: Subscription;

  private venue: Venue;
  private newStand: Stand;

  private confirmStand: boolean;
  private lockedStands: boolean;
  private pendingDeletion = false;

  private canEdit: boolean;

  constructor(
    private deckService: DeckService,
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.reset();

    this.newStandSubscription = this.canvasService.getNewStandSubject()
      .subscribe(stand => {
        this.confirmStand = true;
        this.newStand = stand;
      });

    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => {
        this.reset();
        this.venue = venue;
      });

    this.eventSubscription = this.deckService.getEventSubject()
      .subscribe(event => {
        this.canEdit = this.deckService.isSelectedEventCurrent();
      });
  }

  ngOnDestroy() {
    this.newStandSubscription.unsubscribe();
    this.venueSubscription.unsubscribe();
    this.canvasService.clear();
    this.canvasService.off();
  }

  private reset() {
    this.newStand = undefined;
    this.confirmStand = undefined;
    this.lockedStands = true;
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
    this.venuesService.setVenue(venue);
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
