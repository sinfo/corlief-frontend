import { Component, OnInit } from '@angular/core';
import { VenuesService } from 'src/app/admin/venues/venues.service';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {

  constructor(private venuesService: VenuesService) { }

  ngOnInit() {
  }


}
