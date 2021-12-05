export class Event {
    id: String;
    name: String;
    kind: String;
    public: boolean;
    date: Date;
    duration: Date;

    constructor(event: Event) {
        this.id = event.id;
        this.name = event.name;
        this.kind = event.kind;
        this.public = event.public;
        this.date = new Date(event.date);
        this.duration = new Date(event.duration);
    }

    static fromArray(events: [Event]) {
        const result = [];
        for (const event of events) {
            result.push(new Event(event));
        }
        return result;
    }

    static compare(e1: Event, e2: Event) {
        const t1 = e1.date.getTime();
        const t2 = e2.date.getTime();
        return t1 >= t2 ? 1 : 0;
    }

    getDuration(): number {
        return this.duration.getUTCDate();
    }
}
