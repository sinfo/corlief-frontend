import { Stand } from '../../stand';

export enum CanvasState {
    SETUP, ON, OFF, REVERT, CLEAR, SELECT, SELECT_TO_DELETE
}

export class CanvasCommunication {
    state: CanvasState;
    selectedStand: Stand;

    constructor(state: CanvasState, selectedStand?: Stand) {
        this.state = state;

        if (selectedStand !== undefined) {
            this.selectedStand = selectedStand;
        }
    }
}
