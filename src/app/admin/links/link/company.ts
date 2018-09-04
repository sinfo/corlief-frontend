import { Link } from './link';
import { Event } from '../../event/event';

export class Participation {
    event: String;
    member: String;
    status: String;
    kind: String;
    advertisementLvl: String;

    static getFromEvent(participations: [Participation], event: Event): Participation {
        for (const p of participations) {
            if (p.event === event.id) { return p; }
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
