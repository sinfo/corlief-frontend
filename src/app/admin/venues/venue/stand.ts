export class Stand {
    id: number;
    topLeft: {
        x: number;
        y: number;
    };
    bottomRight: {
        x: number;
        y: number;
    };

    constructor(pair: {
        pos1: { x: number, y: number },
        pos2: { x: number, y: number }
    }) {
        const x = [pair.pos1.x, pair.pos2.x].sort();
        const y = [pair.pos1.y, pair.pos2.y].sort();

        this.topLeft = { x: x[0], y: y[1] };
        this.bottomRight = { x: x[1], y: y[0] };
    }
}
