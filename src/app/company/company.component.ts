import { Component, OnInit } from '@angular/core';

import { DeckService } from 'src/app/deck/deck.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(
    private deckService: DeckService,
    private translate: TranslateService
    ) {
      this.translate.setDefaultLang('pt');
     }

  ngOnInit() {
    this.deckService.updateEvent();
  }

  private changeLang(){
    if(this.translate.currentLang === 'en'){ this.translate.use('pt'); }
    else { this.translate.use('en');}
  }

}
