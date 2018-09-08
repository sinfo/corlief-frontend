import { Stand } from '../../stand';

export enum CanvasState {
    SETUP, ON, OFF, REVERT, CLEAR, SELECT, SELECT_TO_DELETE, SELECT_DAY
}

export class Selected {
    stand?: Stand;
    day?: number;
}

export class CanvasCommunication {
    state: CanvasState;
    selected: Selected;

    constructor(state: CanvasState, selected?: Selected) {
        this.state = state;
        this.selected = selected;
    }
}
