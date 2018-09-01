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
