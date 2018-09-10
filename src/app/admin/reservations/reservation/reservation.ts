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
}

export class Reservation {
    id?: number;
    companyId?: String;
    edition?: String;
    issued?: Date;
    stands: [Stand];
    feedback?: Feedback;

    constructor(reservation?: Reservation) {
        if (reservation) {
            this.id = reservation.id;
            this.companyId = reservation.companyId;
            this.edition = reservation.edition;
            this.issued = reservation.issued;
            this.stands = reservation.stands;
            this.feedback = reservation.feedback;
        } else {
            this.stands = [] as [Stand];
        }
    }

    static fromArray(_reservations: [Reservation]): [Reservation] {
        if (_reservations === undefined) { return [] as [Reservation]; }

        const reservations = [] as [Reservation];

        for (const reservation of _reservations) {
            reservations.push(new Reservation(reservation));
        }

        return reservations;
    }

    isPending(): boolean {
        return this.feedback === undefined || this.feedback.status === 'PENDING';
    }

    isConfirmed(): boolean {
        return this.feedback && this.feedback.status === 'CONFIRMED';
    }

    isCancelled(): boolean {
        return this.feedback && this.feedback.status === 'CANCELLED';
    }

    hasStand(stand: Stand): boolean {
        for (const _stand of this.stands) {
            if (_stand.day === stand.day && _stand.standId === stand.standId) {
                return true;
            }
        }

        return false;
    }

    private getStandIndexByDay(day: number): number {
        return this.stands.findIndex(stand => stand.day === day);
    }

    private addStand(stand: Stand) {
        this.stands.push(stand);
    }

    private removeStand(stand: Stand) {
        this.stands = this.stands.filter(
            _stand => _stand.day !== stand.day || _stand.standId !== stand.standId
        ) as [Stand];
    }

    update(participationDays: number, stand: Stand) {
        const isPending = this.hasStand(stand);

        if (isPending) {
            this.removeStand(stand);
            return;
        }

        const standIndexByDay = this.getStandIndexByDay(stand.day);

        if (standIndexByDay !== -1) {
            this.stands.splice(standIndexByDay, 1);
            this.addStand(stand);
            return;
        }

        if (this.stands.length === participationDays) {
            return;
        }

        this.addStand(stand);
    }
}
