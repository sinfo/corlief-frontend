import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';

import { environment } from '../../../../environments/environment';

import { LinksService } from '../links.service';
import { ClipboardService } from 'ngx-clipboard';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { Link, LinkForm } from './link';
import { Company } from 'src/app/deck/company';
import { Event } from 'src/app/deck/event';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  @Input() company: Company;
  @Input() event: Event;
  @Output() invalidate = new EventEmitter<Link>();

  errorSrc = 'assets/img/hacky.png';
  loadingSrc = 'assets/img/loading.gif';

  linkForm: FormGroup;
  extendLinkForm: FormGroup;

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
      ? Link.linkForm(this.company, this.event)
      : undefined;
  }

  alternateExtendLinkFormVisibility() {
    this.extendLinkForm = this.extendLinkForm === undefined
      ? Link.extendLinkForm(this.event)
      : undefined;
  }

  submitLink() {
    this.linksService.uploadLink(<LinkForm>this.linkForm.value)
      .subscribe(link => {
        this.alternateLinkFormVisibility();
        this.linksService.updateLinks(this.event.id as string);
      });
  }

  revoke() {
    const link = this.company.link;
    this.linksService.revoke(link.companyId, link.edition);
  }

  check() {
    const link = this.company.link;
    this.linksService.check(link.companyId).subscribe(
      value => this.company.link.expirationDate = value.expirationDate,
      error => {
        if (error.status === 410) {
          this.invalidate.emit(link);
        }
      }
    );
  }

  extend() {
    const link = this.company.link;
    const expirationDate = this.extendLinkForm.value;
    this.linksService.extend(link.companyId, link.edition, expirationDate)
      .subscribe(newLink => {
        this.alternateExtendLinkFormVisibility();

        if (!this.company.link.valid) {
          this.linksService.updateLinks(newLink.edition as string);
        } else {
          this.company.link = newLink;
        }
      });
  }

}
