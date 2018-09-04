import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';

import { Link } from './link';
import { Company } from './company';
import { Event } from '../../event/event';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  @Input() company: Company;
  @Input() event: Event;
  @Input() link: Link;

  errorSrc = 'assets/img/hacky.png';
  loadingSrc = 'assets/img/loading.gif';

  linkForm: FormGroup;

  constructor() { }

  ngOnInit() { }

  alternateLinkFormVisibility() {
    this.linkForm = this.linkForm === undefined
      ? Link.generateForm(this.company, this.event)
      : undefined;
  }

  submitLink() {
    console.log('FormValue', this.linkForm.value);
  }

}
