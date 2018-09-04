import { Link } from './link';

export class Participation {
    event: String;
    member: String;
    status: String;
    kind: String;
    advertisementLvl: String;

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
}
