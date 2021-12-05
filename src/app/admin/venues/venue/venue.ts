import { Stand } from './stand';
import { Activity } from './activity';
import { Reservation } from 'src/app/admin/reservations/reservation/reservation';
import { Event } from 'src/app/deck/event';
import { Company } from 'src/app/deck/company';

export class Venue {
    edition: String;
    image: String;
    stands: Stand[];
    activities: {
        kind: String,
        slots: Activity[]
    }[];

    constructor(edition: String, image: String) {
        this.edition = edition;
        this.image = image;
        this.activities = [];
    }
}

export class Availability {
    venue?: Venue;
    availability: [{
        day: number;
        nStands?: number;
        stands: [{
            id: number;
            free: boolean;
            company?: Company;
        }];
        activities: [{
            kind: String;
            slots: [{
                id: number;
                free: boolean;
                company?: Company;
                start: Date;
                end: Date;
            }]
        }];
    }];

    constructor(availability: Availability) {
        this.venue = availability.venue;
        this.availability = availability.availability;
    }

    static generate(event: Event, venue: Venue, reservations: Reservation[], companies: Company[]) {
        const result = {
            venue: venue,
            availability: [] as {
                day: number;
                nStands: number;
                stands: [{
                    id: number;
                    free: boolean;
                    company?: Company;
                }];
                activities: {
                    slots: {
                        id: number;
                        free: boolean;
                        company?: Company;
                        start: Date;
                        end: Date;
                    }[];
                    kind: String;
                }[];
            }[]
        };

        const stands = venue.stands.map(stand => {
            return {
                id: stand.id,
                free: true
            };
        });
        for (let day = 1; day <= event.getDuration(); day++) {

            const activityDay = [] as {
                slots: {
                    id: number;
                    free: boolean;
                    company?: Company;
                    start: Date;
                    end: Date;
                }[];
                kind: String;
            }[];

            for (const activity of venue.activities) {
                const acts = activity.slots.filter(a => a.day === day).map(a => {
                    return {
                        id: a.id,
                        free: true,
                        start: new Date(a.start),
                        end: new Date(a.end)
                    };
                });

                activityDay.push({
                    kind: activity.kind,
                    slots: acts
                });
            }

            result.availability.push({
                day: day,
                nStands: 0,
                stands: Array.from(stands) as [{ id: number; free: boolean; company?: Company; }],
                activities: activityDay,

            });
        }

        const availability = new Availability(result as Availability);
        availability.fillReservations(reservations, companies);

        return availability;
    }

    fillReservations(reservations: Reservation[], companies: Company[]) {
        const confirmed = reservations.filter(r => r.isConfirmed()).sort((r1, r2) => {
            return r1.issued > r2.issued ? 1 : 0;
        });

        for (const reservation of confirmed) {
            for (const stand of reservation.stands) {
                const day = this.availability
                    .map(av => av.day).indexOf(stand.day);

                const selectedStand = this.availability[day].stands
                    .map(s => s.id).indexOf(stand.standId);

                if (selectedStand !== -1) {

                    this.availability[day].stands[selectedStand] = {
                        id: stand.standId,
                        free: false,
                        company: Company.findById(reservation.companyId, companies)
                    };
                } else {

                    this.availability[day].stands.push({
                        id: this.availability[day].nStands,
                        free: false,
                        company: Company.findById(reservation.companyId, companies)
                    });
                }
                this.availability[day].nStands += 1;
            }
            this.availability.forEach(day => {

                for (const activity of reservation.activities) {
                    for (const dayAct of day.activities) {
                        if (dayAct.kind === activity.kind) {
                            for (const slot of dayAct.slots) {
                                if (slot.id === activity.id) {
                                    slot.free = false;
                                    slot.company = Company.findById(reservation.companyId, companies);
                                }
                            }
                        }
                    }
                }
            });

        }
    }

    isFree(selectedDay: number, standId: number): boolean {
        const availability = this.availability;
        const day = availability.filter(_day => _day.day === selectedDay);

        if (day.length === 0) { return false; }

        if (standId === undefined && day[0].nStands >= 25) { return false; }
        const stands = day[0].stands;

        if (stands.length < 1) {
            return true;
        }

        const stand = stands.filter(_stand => _stand.id === standId);

        return stand.length === 0 ? false : stand[0].free;
    }

    isActivityFree(id: number, kind: String) {
        for (const day of this.availability) {
            for (const activity of day.activities) {
                if (activity.kind === kind) {
                    for (const slot of activity.slots) {
                        if (slot.id === id) {
                            return slot.free;
                        }
                    }
                }
            }
        }
        return false;
    }
    getMaxOccupation() {
        let max = 0;
        for (const day of this.availability) {
            if (day.nStands > max) {
                max = day.nStands;
            }
        }
        return max;
    }

    getMaxActivity(activity: string) {
        let max = 0;
        for (const day of this.availability) {
            const act = day.activities.find(a => a.kind === activity);
            if (act && act.slots.length > max) {
                max = act.slots.length;
            }
        }
        return max;
    }
}
