import { Company } from 'src/app/deck/company';
import { Event } from 'src/app/deck/event';

import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export type Advertisement =
    'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'STARTUP';

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
    }

    static linkForm(company: Company, event: Event): FormGroup {
        const duration = event.duration.getDate();
        const participation = company.currentParticipation;
        const advertisementKind = participation && participation.kind
            ? participation.kind : '';

        return new FormGroup({
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
            activities: new FormControl([]),
            expirationDate: new FormControl(new Date(), [
                Validators.required,
                this.expirationDateValidator()
            ])
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

export class Activity {
    kind: String;
    date: Date;
}

export class LinkForm {
    companyId: String;
    companyEmail: String;
    participationDays: number;
    advertisementKind: String;
    activities: [Activity];
    expirationDate: Date;
}
