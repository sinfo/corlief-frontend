export class Activity {
  id: number;
  day: number;
  start: Date;
  end: Date;

  constructor(d: number, s: Date, e: Date) {
    this.day = d;
    this.start = new Date(s);
    this.end = new Date(e);
  }

  static compare(a1: Activity, a2: Activity) {
    if (a1.id === undefined || a2.id === undefined) {
      return 0;
    }

    if (a1.id > a2.id) { return 1; }
    return a1.id === a2.id ? 0 : -1;
  }
}
