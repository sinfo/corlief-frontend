import { Link } from './link';
import { Event } from '../../event/event';

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

    static fillLinks(companies: [Company], links: [Link]): {
        valid: [Company],
        invalid: [Company]
    } {
        const result = {
            valid: [] as [Company],
            invalid: [] as [Company]
        };

        for (const company of companies) {
            const filtered = <[Link]>links.filter(l => l.companyId === company.id);

            if (!filtered.length) {
                continue;
            }

            const link = filtered[0];
            const newCompany = new Company();

            newCompany.id = company.id;
            newCompany.img = company.img;
            newCompany.name = company.name;
            newCompany.currentParticipation =
                company.currentParticipation
                    ? company.currentParticipation
                    : Participation.getFromEdition(company.participations, filtered[0].edition);
            newCompany.link = link;

            if (link.valid) {
                result.valid.push(newCompany);
            } else {
                result.invalid.push(newCompany);
            }
        }

        return result;
    }
}
