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
    links?: [Link];
    validLink?: Link;

    static fillLinks(companies: [Company], links: [Link]): {
        valid: [Company],
        invalid: [Company]
    } {
        const result = {
            valid: [] as [Company],
            invalid: [] as [Company]
        };

        for (const company of companies) {
            const filtered = <[Link]>links.filter(link => link.companyId === company.id);

            if (!filtered.length) {
                continue;
            }

            const valid = filtered.filter(link => link.valid);

            const newCompany = new Company();

            newCompany.id = company.id;
            newCompany.img = company.img;
            newCompany.name = company.name;
            newCompany.currentParticipation =
                company.currentParticipation
                    ? company.currentParticipation
                    : Participation.getFromEdition(company.participations, filtered[0].edition);
            newCompany.links = filtered;

            if (valid.length) {
                newCompany.validLink = valid[0];
                result.valid.push(newCompany);
            } else {
                result.invalid.push(newCompany);
            }
        }

        return result;
    }
}
