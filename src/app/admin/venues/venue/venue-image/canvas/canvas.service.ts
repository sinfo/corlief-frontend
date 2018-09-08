import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { CanvasCommunication, CanvasState, Selected } from './canvasCommunication';
import { Stand } from '../../stand';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  private commSubject = new BehaviorSubject<CanvasCommunication>(
    new CanvasCommunication(CanvasState.OFF)
  );
  private newStandSubject = new BehaviorSubject<Stand>(undefined);

  constructor() { }

  setup() {
    const comm = this.buildCanvasCommunication(CanvasState.SETUP);
    this.commSubject.next(comm);
  }

  on() {
    const comm = this.buildCanvasCommunication(CanvasState.ON);
    this.commSubject.next(comm);
  }

  off() {
    const comm = this.buildCanvasCommunication(CanvasState.OFF);
    this.commSubject.next(comm);
  }

  revert(selectedStand?: Stand) {
    const comm = this.buildCanvasCommunication(CanvasState.REVERT, { stand: selectedStand });
    this.commSubject.next(comm);
  }

  clear() {
    const comm = this.buildCanvasCommunication(CanvasState.CLEAR);
    this.commSubject.next(comm);
  }

  selectDay(day: number) {
    const comm = this.buildCanvasCommunication(CanvasState.SELECT_DAY, { day: day });
    this.commSubject.next(comm);
  }

  select(selectedStand: Stand) {
    const comm = this.buildCanvasCommunication(CanvasState.SELECT, { stand: selectedStand });
    this.commSubject.next(comm);
  }

  selectToDelete(selectedStand: Stand) {
    const comm = this.buildCanvasCommunication(CanvasState.SELECT_TO_DELETE, { stand: selectedStand });
    this.commSubject.next(comm);
  }

  getCommunicationSubject(): Observable<CanvasCommunication> {
    return this.commSubject.asObservable();
  }

  addNewStand(stand: Stand) {
    this.newStandSubject.next(stand);
  }

  cancelNewStand() {
    this.newStandSubject.next(undefined);
  }

  getNewStandSubject(): Observable<Stand> {
    return this.newStandSubject.asObservable();
  }

  private buildCanvasCommunication(state: CanvasState, selected?: Selected) {
    const comm = selected
      ? new CanvasCommunication(state, selected)
      : new CanvasCommunication(state);

    return comm;
  }
}
