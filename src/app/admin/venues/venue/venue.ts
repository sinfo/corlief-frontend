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
    lunchTalks: Activity[];

    constructor(edition: String, image: String) {
        this.edition = edition;
        this.image = image;
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
        lunchTalks: [{
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
                nStands: number;
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
                lunchTalks: [{
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

            const lts = venue.lunchTalks.filter(lt => lt.day === day).map(lt => {
                return {
                    id: lt.id,
                    free: true,
                    start: new Date(lt.start),
                    end: new Date(lt.end)
                };
            });

            result.availability.push({
                day: day,
                nStands: 0,
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
                lunchTalks: Array.from(lts) as [{
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
                if (reservation.workshop !== undefined) {
                    day.workshops.forEach(ws => {
                        if (ws.id === reservation.workshop) {
                            ws.free = false;
                            ws.company = Company.findById(reservation.companyId, companies);
                        }
                    });
                }
                if (reservation.presentation !== undefined) {
                    day.presentations.forEach(p => {
                        if (p.id === reservation.presentation) {
                            p.free = false;
                            p.company = Company.findById(reservation.companyId, companies);
                        }
                    });
                }
                if (reservation.lunchTalk !== undefined) {
                    day.lunchTalks.forEach(p => {
                        if (p.id === reservation.lunchTalk) {
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
        if (stands.length < 1) {
            return true;
        }

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

    isLunchTalkFree(wsId: number) {
        for (const day of this.availability) {
            for (const ws of day.lunchTalks) {
                if (ws.id === wsId) {
                    return ws.free;
                }
            }
        }
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
            if (day[activity].length > max) {
                max = day[activity].length;
            }
        }
        return max;
    }
}
