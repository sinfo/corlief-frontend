import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { CanvasCommunication, CanvasState } from './canvasCommunication';
import { Stand } from '../../stand';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  commSubject = new BehaviorSubject<CanvasCommunication>(
    new CanvasCommunication(CanvasState.OFF)
  );
  newStandSubject = new BehaviorSubject<Stand>(undefined);

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
    const comm = this.buildCanvasCommunication(CanvasState.REVERT, selectedStand);
    this.commSubject.next(comm);
  }

  clear() {
    const comm = this.buildCanvasCommunication(CanvasState.CLEAR);
    this.commSubject.next(comm);
  }

  select(selectedStand: Stand) {
    const comm = this.buildCanvasCommunication(CanvasState.SELECT, selectedStand);
    this.commSubject.next(comm);
  }

  selectToDelete(selectedStand: Stand) {
    const comm = this.buildCanvasCommunication(CanvasState.SELECT_TO_DELETE, selectedStand);
    this.commSubject.next(comm);
  }

  getCommunicationSubject(): Observable<CanvasCommunication> {
    return this.commSubject.asObservable();
  }

  addNewStand(stand: Stand) {
    this.newStandSubject.next(stand);
  }

  getNewStandSubject(): Observable<Stand> {
    return this.newStandSubject.asObservable();
  }

  private buildCanvasCommunication(state: CanvasState, selectedStand?: Stand) {
    const comm = selectedStand !== undefined
      ? new CanvasCommunication(state, selectedStand)
      : new CanvasCommunication(state);

    return comm;
  }
}
