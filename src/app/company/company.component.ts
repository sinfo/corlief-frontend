import { Component, OnInit } from '@angular/core';

import { DeckService } from 'src/app/deck/deck.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  languageSet = 'en';

  langs = [
    {
      flag: 'assets/flags/pt.svg',
      lang: 'pt',
    },
    {
      flag: 'assets/flags/gb.svg',
      lang: 'en',
    }
  ];

  constructor(
    private deckService: DeckService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang(this.languageSet);
  }

  ngOnInit() {
    this.deckService.updateEvent();
  }

  private changeLang(lang: string) {
    if (this.languageSet === lang) { return; }
    this.translate.use(lang);
    this.languageSet = lang;
  }

}
