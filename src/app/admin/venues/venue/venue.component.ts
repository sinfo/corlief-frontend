import { Component, OnInit, Input } from '@angular/core';
import { Venue } from './venue';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

  @Input() venue: Venue;
  @Input() canBeEdited: boolean;

  loadingSrc: String = 'assets/img/loading.gif';

  constructor() { }

  ngOnInit() {
  }

  loaded(event: any) {
    console.log('done');
  }

}
