import { Component, OnInit } from '@angular/core';

import { EventService } from 'src/app/admin/event/event.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.updateEvent();
  }

}
