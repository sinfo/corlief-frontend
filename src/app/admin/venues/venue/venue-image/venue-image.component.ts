import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { VenuesService } from '../../venues.service';
import { CanvasService } from './canvas/canvas.service';

import { Venue } from '../venue';
import { Stand } from 'src/app/admin/venues/venue/stand';
import { CanvasState, CanvasCommunication } from './canvas/canvasCommunication';

@Component({
  selector: 'app-venue-image',
  templateUrl: './venue-image.component.html',
  styleUrls: ['./venue-image.component.css']
})
export class VenueImageComponent implements OnInit, OnDestroy {

  private venueSubscription: Subscription;
  private canvasSubscription: Subscription;
  private venue: Venue;

  @Input() maxWidth = 50;

  private loadingSrc = 'assets/img/loading.gif';
  private confirmStand: boolean;
  private newStand: Stand;
  private canvasOn = false;

  constructor(
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.venue = venue);

    this.canvasSubscription = this.canvasService.getCommunicationSubject()
      .subscribe((comm: CanvasCommunication) => {
        switch (comm.state) {
          case CanvasState.ON:
            this.canvasOn = true;
            break;

          case CanvasState.OFF:
            this.canvasOn = false;
            break;

          case CanvasState.CLEAR:
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