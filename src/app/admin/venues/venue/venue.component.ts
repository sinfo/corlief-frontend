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

  loaded(event: any) {
    this.loadingCompleted = true;
    console.log('done!');
    console.log('offsetheight', this.venueView.nativeElement.offsetHeight);
  }

}
