export class Feedback {
    status: String;
    member: String;
}

export class Stand {
    day: number;
    standId: number;

    constructor(day: number, standId: number) {
        this.day = day;
        this.standId = standId;
    }

    static hasStand(stands: [Stand], day: number, standId: number): boolean {
        for (const stand of stands) {
            if (stand.day === day && stand.standId === standId) {
                return true;
            }
        }

        return false;
    }

    static removeStand(stands: [Stand], day: number, standId: number): [Stand] {
        return stands.filter(stand => stand.day !== day || stand.standId !== standId) as [Stand];
    }
}

export class Reservation {
    id: number;
    companyId: String;
    edition: String;
    issued: Date;
    stands: [Stand];
    feedback: Feedback;
}
