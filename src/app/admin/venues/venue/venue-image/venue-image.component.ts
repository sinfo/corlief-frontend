import { Component, OnInit, Input } from '@angular/core';

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
export class VenueImageComponent implements OnInit {

  venueSubscription: Subscription;
  venue: Venue;

  @Input() canBeEdited = false;
  @Input() maxWidth = 50;

  loadingSrc = 'assets/img/loading.gif';
  confirmStand: boolean;
  newStand: Stand;

  constructor(
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.venue = venue);
  }

  canvasStateSetup() {
    this.canvasService.setup();
  }
}
