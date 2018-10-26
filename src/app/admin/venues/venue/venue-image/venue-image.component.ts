import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { VenuesService } from '../../venues.service';
import { CanvasService } from './canvas/canvas.service';
import { ReservationsService } from 'src/app/admin/reservations/reservations.service';

import { Venue } from '../venue';
import { Stand } from 'src/app/admin/venues/venue/stand';
import { CanvasState, CanvasActionCommunication, CanvasAction } from './canvas/canvasCommunication';

@Component({
  selector: 'app-venue-image',
  templateUrl: './venue-image.component.html',
  styleUrls: ['./venue-image.component.css']
})
export class VenueImageComponent implements OnInit, OnDestroy {

  private venueSubscription: Subscription;
  private canvasSubscription: Subscription;
  private reservationsSubscription: Subscription;

  private venue: Venue;

  @Input() maxWidth;
  @Input() maxHeight;
  @Input() state: CanvasState;

  private loadingSrc = 'assets/img/loading.gif';
  private confirmStand: boolean;
  private newStand: Stand;
  private canvasOn = false;

  constructor(
    private venuesService: VenuesService,
    private canvasService: CanvasService,
    private reservationsService: ReservationsService
  ) { }

  ngOnInit() {
    if (this.maxWidth === undefined && this.maxHeight === undefined) {
      this.maxWidth = 50;
    }

    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.venue = venue);

    this.canvasSubscription = this.canvasService.getCommunicationSubject()
      .subscribe((comm: CanvasActionCommunication) => {
        switch (comm.action) {
          case CanvasAction.ON:
            this.canvasOn = true;
            break;

          case CanvasAction.OFF:
            this.canvasOn = false;
            break;

          case CanvasAction.CLEAR:
            this.canvasOn = false;
            break;
        }
      });
  }

  ngOnDestroy() {
    this.venueSubscription.unsubscribe();
    this.canvasSubscription.unsubscribe();
  }

  private canvasStateSetup() {
    this.canvasService.setup();
  }
}
