import { Stand } from './stand';

export class Venue {
    edition: String;
    image: String;
    stands: [Stand];

    constructor(edition: String, image: String) {
        this.edition = edition;
        this.image = image;
    }
}

export class Availability {
    venue?: Venue;
    availability: [{
        day: number;
        stands: [{
            id: number;
            free: boolean;
        }]
    }];

    constructor(availability: Availability) {
        this.venue = availability.venue;
        this.availability = availability.availability;
    }

    isFree(selectedDay: number, standId: number): boolean {
        const availability = this.availability;
        const day = availability.filter(_day => _day.day === selectedDay);

        if (day.length === 0) { return false; }

        const stands = day[0].stands;

        const stand = stands.filter(_stand => _stand.id === standId);

        return stand.length === 0 ? false : stand[0].free;
    }
}
