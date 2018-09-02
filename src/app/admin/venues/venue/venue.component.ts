import { Component, OnChanges, Input } from '@angular/core';
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

  loadingSrc: String = 'assets/img/loading.gif';

  private canvasOnSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  updateCanvasState() {
    this.canvasOnSubject.next(this.canBeEdited);
  }

  onUpdateVenue(venue: Venue) {
    this.venue = venue;
  }

}
