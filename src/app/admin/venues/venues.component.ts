import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';

import { VenuesService } from 'src/app/admin/venues/venues.service';
import { Venue } from './venue/venue';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {

  current: Venue;
  selected: Venue;
  canBeEdited: boolean;

  constructor(private venuesService: VenuesService) { }

  ngOnInit() {
    this.getCurrent();
  }

  getCurrent() {
    this.venuesService.getCurrentVenue().subscribe(
      venue => {
        this.current = venue;
        this.selected = venue;
        this.canBeEdited = true;
      },
      error => {
        if (error.status === 404) {
          this.current = null;
          this.canBeEdited = false;
        } else {
          console.error(error);
        }
      }
    );
  }
}
