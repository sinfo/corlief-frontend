export class Activity {
  id: number;
  day: number;
  start: Date;
  end: Date;
  kind: String;

  constructor(d: number, s: Date, e: Date, k: String) {
    this.day = d;
    this.start = new Date(s);
    this.end = new Date(e);
    this.kind = k;
  }

  static compare(a1: Activity, a2: Activity) {
    if (a1.kind === a2.kind) {
      if (a1.id === undefined || a2.id === undefined) {
        return 0;
      }

      if (a1.id > a2.id) { return 1; }
      return a1.id === a2.id ? 0 : -1;
    } else { return a1.kind < a2.kind; }
  }

  public toString = (): string => {
    return `${this.kind} (${this.id}, ${this.day}, ${this.start}, ${this.end})`;
  }
}
