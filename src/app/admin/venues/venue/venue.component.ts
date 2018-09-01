import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Venue } from './venue';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

  @Input() venue: Venue;
  @Input() canBeEdited: boolean;

  @ViewChild('venueImage') venueView: ElementRef;

  loadingSrc: String = 'assets/img/loading.gif';
  loadingCompleted = false;

  constructor() { }

  ngOnInit() {
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
