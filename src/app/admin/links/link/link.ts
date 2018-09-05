import { Company } from './company';
import { Event } from '../../event/event';

import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export type Advertisement =
    'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'STARTUP';

export class Link {
    companyId: String;
    edition: String;
    created: Date;
    token: String;
    valid: boolean;
    advertisementKind: Advertisement;
    participationDays: number;

    static linkForm(company: Company, event: Event): FormGroup {
        const duration = event.duration.getDate();
        const participation = company.currentParticipation;
        const advertisementKind = participation && participation.kind
            ? participation.kind : '';

        return new FormGroup({
            companyId: new FormControl(company.id, [
                Validators.required
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
    participationDays: number;
    advertisementKind: String;
    activities: [Activity];
    expirationDate: Date;
}
