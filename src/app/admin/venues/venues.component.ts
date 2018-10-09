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

  constructor(private venuesService: VenuesService) { }

  ngOnInit() {
    this.venuesService.getVenue().subscribe(venue => {
      this.venuesService.setVenue(venue);
    });
  }
}
