import { Component, OnChanges, Input, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Venue } from './venue';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent {

  @Input() venue: Venue;
  @Input() canBeEdited: boolean;

  @ViewChild('venueImage') venueView: ElementRef;

  loadingSrc: String = 'assets/img/loading.gif';

  private canvasOnSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  updateCanvasState() {
    this.canvasOnSubject.next(this.canBeEdited);
  }

  onUpdateVenue(venue: Venue) {
    // As the new url is the same, but the image stored is different,
    // the img tag has no way of knowing that it changed, so it doesn't
    // make the request for the new image.
    // By changing the url, it forces the reload.
    this.venue.image = this.loadingSrc;
    this.venue = venue;
  }

}
