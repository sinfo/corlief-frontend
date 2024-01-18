import { Link } from '../admin/links/link/link';
import { Event } from './event';

export class Item {
    name: String;
    description: String;
    type: String;
    cost: Number;
    vat: Number;
}

export class Package {
    name: String;
    items?: [Item];
}

export class Participation {
    event: String;
    member: String;
    status: String;
    kind: String;
    advertisementLvl: String;
    partner: Boolean;

    static getFromEvent(participations: [Participation], event: Event): Participation {
        return Participation.getFromEdition(participations, event.id);
    }

    static getFromEdition(participations: [Participation], edition: String): Participation {
        for (const p of participations) {
            if (p.event.toString() === edition) { return p; }
        } return null;
    }
}

export class Company {
    id: String;
    img: String;
    description: String;

    name?: String;
    participation?: [Participation];

    currentParticipation: Participation;
    link?: Link;

    static filter(company: Company, edition: String) {
        if (company.participation === undefined || !company.participation.length) {
            return false;
        }

        if (company.currentParticipation === undefined) {
            company.currentParticipation = Participation.getFromEdition(company.participation, edition);
        }

        if (company.currentParticipation === null || company.currentParticipation.partner) {
            return false;
        }

        return true;
    }

    static findById(id: String, companies: Company[]) {
        const found = companies.filter(company => company.id === id);
        return found.length > 0 ? found[0] as Company : null;
    }
}
