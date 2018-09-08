import { Component, OnInit } from '@angular/core';

import { CompanyService } from './company.service';
import { VenuesService } from '../admin/venues/venues.service';
import { CanvasService } from '../admin/venues/venue/venue-image/canvas/canvas.service';

import { Availability } from '../admin/venues/venue/venue';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.companyService.getVenueAvailability().subscribe(availability => {
      this.venuesService.setVenue(availability.venue);
      this.venuesService.setAvailability(availability);
      this.canvasService.selectDay(1);
    });
  }

}
