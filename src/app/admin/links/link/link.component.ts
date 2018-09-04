import { Component, OnInit, Input } from '@angular/core';

import { Link } from './link';
import { Company } from './company';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  @Input() company: Company;
  @Input() edition: String;
  @Input() link: Link;

  errorSrc = 'assets/img/hacky.png';
  loadingSrc = 'assets/img/loading.gif';

  constructor() { }

  ngOnInit() {
  }

}
