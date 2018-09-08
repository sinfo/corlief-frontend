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
}
