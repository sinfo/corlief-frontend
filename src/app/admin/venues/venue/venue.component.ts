import { Component, OnInit, OnChanges, OnDestroy, Input, Inject } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs';

import { VenuesService } from 'src/app/admin/venues/venues.service';
import { CanvasService } from 'src/app/admin/venues/venue/venue-image/canvas/canvas.service';
import { DeckService } from 'src/app/deck/deck.service';

import { CanvasState } from './venue-image/canvas/canvasCommunication';
import { Venue } from './venue';
import { Stand } from './stand';
import { Activity } from './activity';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivityDialogComponent } from './dialogs/activity-dialog/activity-dialog.component';

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

  venue: Venue;
  private newStand: Stand;
  activities: Activity[][];

  private confirmStand: boolean;
  private lockedStands: boolean;
  private pendingDeletion = false;

  canEdit: boolean;
  duration: number;

  constructor(
    private deckService: DeckService,
    private venuesService: VenuesService,
    private canvasService: CanvasService,
    private matDialog: MatDialog,
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
        this.duration = event.getDuration();
      });
  }

  ngOnDestroy() {
    this.newStandSubscription.unsubscribe();
    this.venueSubscription.unsubscribe();
    this.canvasService.clear();
    this.canvasService.off();
  }

  newWorkshopDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { title: 'Create Workshop', duration: this.duration };
    const dialogRef = this.matDialog.open(ActivityDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      const start = new Date(0);
      start.setUTCHours(result.start.hour);
      start.setUTCMinutes(result.start.minute);
      console.log(start)
      const end = new Date(0);
      end.setUTCHours(result.end.hour);
      end.setUTCMinutes(result.end.minute);
      const newWs = new Activity(result.day, start, end);
      this.venuesService.uploadWorkshop(newWs).subscribe(
        (venue: Venue) => {
          this.venuesService.setVenue(venue);
          this.venue = venue;
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
    });
  }

  newPresentationDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { title: 'Create Presentation', duration: this.duration };
    const dialogRef = this.matDialog.open(ActivityDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      const start = new Date(0);
      start.setUTCHours(result.start.hour - 1); // Terrible fix to keep all times in UTC+0100
      start.setUTCMinutes(result.start.minute);
      const end = new Date(0);
      end.setUTCHours(result.end.hour - 1);
      end.setUTCMinutes(result.end.minute);
      const newPres = new Activity(result.day, start, end);
      this.venuesService.uploadPresentation(newPres).subscribe(
        (venue: Venue) => {
          this.venuesService.setVenue(venue);
          this.venue = venue;
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
    });
  }

  newLunchTalkDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { title: 'Create Lunch Talk', duration: this.duration };
    const dialogRef = this.matDialog.open(ActivityDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      const start = new Date(0);
      start.setUTCHours(result.start.hour - 1); // Terrible fix to keep all times in UTC+0100
      start.setUTCMinutes(result.start.minute);
      const end = new Date(0);
      end.setUTCHours(result.end.hour - 1);
      end.setUTCMinutes(result.end.minute);
      const newLT = new Activity(result.day, start, end);
      this.venuesService.uploadLunchTalk(newLT).subscribe(
        (venue: Venue) => {
          this.venuesService.setVenue(venue);
          this.venue = venue;
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
    });
  }

  deleteWorkshop(id: number) {
    this.venuesService.deleteWorkshop(id).subscribe(venue => {
      this.venuesService.setVenue(venue);
    });
  }

  deletePresentation(id: number) {
    this.venuesService.deletePresentation(id).subscribe(venue => {
      this.venuesService.setVenue(venue);
    });
  }

  deleteLunchTalk(id: number) {
    this.venuesService.deleteLunchTalk(id).subscribe(venue => {
      this.venuesService.setVenue(venue);
    });
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
