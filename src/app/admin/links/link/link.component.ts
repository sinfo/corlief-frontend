import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';

import { environment } from '../../../../environments/environment';

import { LinksService } from '../links.service';
import { ClipboardService } from 'ngx-clipboard';
import { NgbTooltip, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { Link, LinkForm, LinkEdit } from './link';
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
  @Input() kinds: String[];
  @Output() invalidate = new EventEmitter<Link>();

  errorSrc = 'assets/img/hacky.png';
  loadingSrc = 'assets/img/loading.gif';

  linkForm: FormGroup;
  editLinkForm: FormGroup;
  extendLinkForm: FormGroup;

  closeLinkFormResult: string;

  constructor(
    private linksService: LinksService,
    private clipboardService: ClipboardService,
    private modalService: NgbModal
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

  alternateExtendLinkFormVisibility() {
    this.extendLinkForm = this.extendLinkForm === undefined
      ? Link.extendLinkForm(this.event)
      : undefined;
  }

  submitLink(modal) {
    const activities = [];
    const form = <LinkForm>this.linkForm.value;
    for (const kind of this.kinds) {
      if (form[kind.toString()]) {
        activities.push(kind);
      }
      delete form[kind.toString()];
    }
    form.activities = activities;
    this.linksService.uploadLink(form)
      .subscribe(link => {
        modal.close();
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
        if (!this.company.link.valid) {
          this.linksService.updateLinks(newLink.edition as string);
        } else {
          this.company.link = newLink;
          this.extendLinkForm = undefined;
        }
      });
  }

  edit(modal) {
    const activities = [];
    const form = this.editLinkForm.value;
    for (const kind of this.kinds) {
      if (form[kind.toString()]) {
        activities.push(kind);
      }
      delete form[kind.toString()];
    }
    form.activities = activities;
    const linkEdit = new LinkEdit(form);
    this.linksService.edit(linkEdit, this.event, this.company.id)
      .subscribe(link => {
        modal.close();
        this.linksService.updateLinks(this.event.id as string);
      });
  }

  openLinkForm(content) {
    this.linkForm = Link.linkForm(this.company, this.event, this.kinds);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeLinkFormResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeLinkFormResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditLinkForm(content) {
    this.editLinkForm = LinkEdit.editLinkForm(this.company.link, this.event, this.kinds);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeLinkFormResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeLinkFormResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
