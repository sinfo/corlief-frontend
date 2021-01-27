import { Stand } from './stand';
import { Activity } from './activity';
import { Reservation } from 'src/app/admin/reservations/reservation/reservation';
import { Event } from 'src/app/deck/event';
import { Company } from 'src/app/deck/company';

export class Venue {
    edition: String;
    image: String;
    stands: Stand[];
    presentations: Activity[];
    workshops: Activity[];

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
            company?: Company;
        }];
        workshops: [{
            id: number;
            free: boolean;
            company?: Company;
            start: Date;
            end: Date;
        }];
        presentations: [{
            id: number;
            free: boolean;
            company?: Company;
            start: Date;
            end: Date;
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
                stands: [{
                    id: number;
                    free: boolean;
                    company?: Company;
                }];
                workshops: [{
                    id: number;
                    free: boolean;
                    company?: Company;
                    start: Date;
                    end: Date;
                }];
                presentations: [{
                    id: number;
                    free: boolean;
                    company?: Company;
                    start: Date;
                    end: Date;
                }];
            }[]
        };

        const stands = venue.stands.map(stand => {
            return {
                id: stand.id,
                free: true
            };
        });

        for (let day = 1; day <= event.getDuration(); day++) {

            const ws = venue.workshops.filter(w => w.day === day).map(w => {
                return {
                    id: w.id,
                    free: true,
                    start: new Date(w.start),
                    end: new Date(w.end)
                };
            });

            const pres = venue.presentations.filter(p => p.day === day).map(p => {
                return {
                    id: p.id,
                    free: true,
                    start: new Date(p.start),
                    end: new Date(p.end)
                };
            });

            result.availability.push({
                day: day,
                stands: Array.from(stands) as [{ id: number; free: boolean; company?: Company; }],
                workshops: Array.from(ws) as [{
                    id: number;
                    free: boolean;
                    company?: Company;
                    start: Date;
                    end: Date;
                }],
                presentations: Array.from(pres) as [{
                    id: number;
                    free: boolean;
                    company?: Company;
                    start: Date;
                    end: Date;
                }],


            });
        }

        const availability = new Availability(result as Availability);
        availability.fillReservations(reservations, companies);

        return availability;
    }

    fillReservations(reservations: Reservation[], companies: Company[]) {
        const confirmed = reservations.filter(r => r.isConfirmed());

        for (const reservation of confirmed) {
            for (const stand of reservation.stands) {
                const day = this.availability
                    .map(av => av.day).indexOf(stand.day);

                const selectedStand = this.availability[day].stands
                    .map(s => s.id).indexOf(stand.standId);

                this.availability[day].stands[selectedStand] = {
                    id: stand.standId,
                    free: false,
                    company: Company.findById(reservation.companyId, companies)
                };
            }
            this.availability.forEach(day => {
                if (reservation.workshop) {
                    day.workshops.forEach(ws => {
                        if (ws.id === reservation.workshop) {
                            ws.free = false;
                            ws.company = Company.findById(reservation.companyId, companies);
                        }
                    });
                }
                if (reservation.presentation) {
                    day.presentations.forEach(p => {
                        if (p.id === reservation.presentation) {
                            p.free = false;
                            p.company = Company.findById(reservation.companyId, companies);
                        }
                    });
                }
            });

        }
    }

    isFree(selectedDay: number, standId: number): boolean {
        const availability = this.availability;
        const day = availability.filter(_day => _day.day === selectedDay);

        if (day.length === 0) { return false; }

        const stands = day[0].stands;

        const stand = stands.filter(_stand => _stand.id === standId);

        return stand.length === 0 ? false : stand[0].free;
    }

    isWsFree(wsId: number) {
        for (const day of this.availability) {
            for (const ws of day.workshops) {
                if (ws.id === wsId) {
                    return ws.free;
                }
            }
        }
    }

    isPresFree(wsId: number) {
        for (const day of this.availability) {
            for (const ws of day.presentations) {
                if (ws.id === wsId) {
                    return ws.free;
                }
            }
        }
    }
}
