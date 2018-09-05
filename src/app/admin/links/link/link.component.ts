import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';

import { environment } from '../../../../environments/environment';

import { LinksService } from '../links.service';
import { ClipboardService } from 'ngx-clipboard';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { Link, LinkForm } from './link';
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

  constructor(
    private linksService: LinksService,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit() { }

  copyToClipboard(tooltip: NgbTooltip, token: String) {
    setTimeout(() => {
      if (tooltip.isOpen()) {
        tooltip.close();
      }
    }, 1000);

    const url = `${environment.frontend}/token/${token}`;
    this.clipboardService.copyFromContent(url);
  }

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

  revoke(link: Link) {
    this.linksService.revokeLink(link.companyId, link.edition);
  }

}
