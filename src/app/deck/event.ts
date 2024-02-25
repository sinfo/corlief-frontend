export class Event {
    id: String;
    name: String;
    begin: Date;
    end: Date;

    constructor(event: Event) {
        this.id = event.id;
        this.name = event.name;
        this.begin = new Date(event.begin);
        this.end = new Date(event.end);
    }

    static fromArray(events: [Event]) {
        const result = [];
        for (const event of events) {
            result.push(new Event(event));
        }
        return result;
    }

    static compare(e1: Event, e2: Event) {
        const t1 = e1.begin.getTime();
        const t2 = e2.begin.getTime();
        return t1 >= t2 ? 1 : 0;
    }

    getDuration(): number {
        const beginDate = new Date(this.begin).getTime()
        const endDate = new Date(this.end).getTime()
        return new Date(endDate - beginDate).getUTCDate()
    }
}
