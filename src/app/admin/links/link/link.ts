import { Company } from 'src/app/deck/company';
import { Event } from 'src/app/deck/event';

import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export type Advertisement =
    'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'STARTUP';

export class LinkEdit {
    companyId: String;
    companyContact: String;
    memberContact: String;
    advertisementKind: Advertisement;
    participationDays: number;

    constructor(form: FormGroup) {
        const data = form.value;

        this.companyContact = data.companyContact;
        this.memberContact = data.memberContact;
        this.advertisementKind = data.advertisementKind;
        this.participationDays = data.participationDays;
    }

    static editLinkForm(link: Link, event: Event): FormGroup {
        const duration = event.duration.getDate();

        return new FormGroup({
            companyContact: new FormControl(link.contacts.company, [
                Validators.required,
                Validators.email
            ]),
            memberContact: new FormControl(link.contacts.member, [
                Validators.required,
                Validators.email
            ]),
            participationDays: new FormControl(link.participationDays, [
                Validators.required,
                Validators.min(1),
                Validators.max(duration)
            ]),
            advertisementKind: new FormControl(link.advertisementKind, [
                Validators.required,
                Validators.minLength(0)
            ])
        });
    }
}

export class Link {
    companyId: String;
    contacts: {
        company: String,
        member: String
    };
    edition: String;
    created: Date;
    token: String;
    valid: boolean;
    advertisementKind: Advertisement;
    participationDays: number;
    expirationDate?: Date;
    activities?: String[];

    constructor(link: Link) {
        this.companyId = link.companyId;
        this.contacts = link.contacts;
        this.edition = link.edition;
        this.created = link.created;
        this.token = link.token;
        this.valid = link.valid;
        this.advertisementKind = link.advertisementKind;
        this.participationDays = link.participationDays;
        this.expirationDate = link.expirationDate;
        this.activities = link.activities;
    }

    static linkForm(company: Company, event: Event, kinds: String[]): FormGroup {
        const duration = event.duration.getDate();
        const participation = company.currentParticipation;
        const advertisementKind = participation && participation.kind
            ? participation.kind : '';

        const controls = {
            companyId: new FormControl(company.id, [
                Validators.required
            ]),
            companyEmail: new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            participationDays: new FormControl(1, [
                Validators.required,
                Validators.min(1),
                Validators.max(duration)
            ]),
            advertisementKind: new FormControl(advertisementKind, [
                Validators.required,
                Validators.minLength(0)
            ]),
            expirationDate: new FormControl(new Date(), [
                Validators.required,
                this.expirationDateValidator()
            ])
        };

        kinds.forEach(e => {
            controls[e.toString()] = new FormControl(false, [
                Validators.required
            ]);
        });



        return new FormGroup(controls);
    }

    static linkFromEditLinkForm(link: Link, form: FormGroup, event: Event): Link {
        const data = form.value;
        return new Link({
            companyId: data.companyId,
            contacts: {
                company: data.companyEmail,
                member: data.memberEmail
            },
            edition: event.id,
            created: link.created,
            token: link.token,
            valid: link.valid,
            advertisementKind: data.advertisementKind,
            participationDays: data.participationDays,
            activities: link.activities
        });
    }

    static extendLinkForm(event: Event): FormGroup {
        const duration = event.duration.getDate();

        return new FormGroup({
            expirationDate: new FormControl(new Date(), [
                Validators.required,
                this.expirationDateValidator()
            ])
        });
    }

    static expirationDateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const now = new Date().getTime();
            const expiration = new Date(control.value).getTime();
            return expiration > now ? null : { 'expirationDate': { value: control.value } };
        };
    }
}


export class LinkForm {
    companyId: String;
    companyEmail: String;
    participationDays: number;
    advertisementKind: String;
    activities: String[];
    expirationDate: Date;
}
