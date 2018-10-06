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

    getDuration(): number {
        return this.duration.getDate();
    }
}
