import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';

import { VenuesService } from 'src/app/admin/venues/venues.service';
import { Venue } from './venue';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {

  venue: Venue;

  constructor(private venuesService: VenuesService) { }

  ngOnInit() {
  }
}
