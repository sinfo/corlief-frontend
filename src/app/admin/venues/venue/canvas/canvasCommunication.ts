export enum CanvasState {
    SETUP, ON, OFF, REVERT, CLEAR
}

export class CanvasCommunication {
    state: CanvasState;
    selectedStand: number;

    constructor(state: CanvasState, selectedStand?: number) {
        this.state = state;

        if (selectedStand !== undefined) {
            this.selectedStand = selectedStand;
        }
    }
}
