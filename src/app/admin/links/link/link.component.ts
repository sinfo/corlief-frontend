import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';

import { Link, LinkForm } from './link';
import { Company } from './company';
import { Event } from '../../event/event';
import { LinksService } from '../links.service';

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

  constructor(private linksService: LinksService) { }

  ngOnInit() { }

  alternateLinkFormVisibility() {
    this.linkForm = this.linkForm === undefined
      ? Link.generateForm(this.company, this.event)
      : undefined;
  }

  submitLink() {
    this.linksService.uploadLink(<LinkForm>this.linkForm.value)
      .subscribe(link => {
        this.alternateLinkFormVisibility();
        this.linksService.updateLinks(this.event.id as string);
      });
  }

}
