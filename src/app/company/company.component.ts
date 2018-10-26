import { Component, OnInit } from '@angular/core';

import { DeckService } from 'src/app/deck/deck.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private deckService: DeckService) { }

  ngOnInit() {
    this.deckService.updateEvent();
  }

}
