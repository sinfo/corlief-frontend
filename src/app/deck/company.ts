import { Link } from '../admin/links/link/link';
import { Event } from './event';

export class Participation {
    event: String;
    member: String;
    status: String;
    kind: String;
    advertisementLvl: String;

    static getFromEvent(participations: [Participation], event: Event): Participation {
        return Participation.getFromEdition(participations, event.id);
    }

    static getFromEdition(participations: [Participation], edition: String): Participation {
        for (const p of participations) {
            if (p.event === edition) { return p; }
        } return null;
    }
}

export class Company {
    id: String;
    img: String;

    name?: String;
    participations?: [Participation];

    currentParticipation: Participation;
    link?: Link;

    static filter(company: Company, edition: String) {
        if (company.participations === undefined || !company.participations.length) {
            return false;
        }

        if (company.currentParticipation === undefined) {
            company.currentParticipation = Participation.getFromEdition(company.participations, edition);
        }

        if (company.currentParticipation === null || company.currentParticipation.kind === 'Partnership') {
            return false;
        }

        return ['in-conversations', 'closed-deal', 'announced']
            .includes(company.currentParticipation.status as string);
    }

    static findById(id: String, companies: Company[]) {
        const found = companies.filter(company => company.id === id);
        return found.length > 0 ? found[0] as Company : null;
    }
}
