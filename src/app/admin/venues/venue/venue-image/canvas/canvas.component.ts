import {
  Component, OnInit, OnDestroy,
  AfterViewInit, ElementRef, ViewChild, SimpleChanges,
  SimpleChange, Input, Output, EventEmitter
} from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';

import { VenuesService } from '../../../venues.service';
import { CanvasService } from './canvas.service';

import { CanvasState, CanvasCommunication } from './canvasCommunication';
import { Stand } from '../../stand';
import { Venue } from '../../venue';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

  @ViewChild('canvas') public canvas: ElementRef;
  defaultColor = '#00386f';
  selectedColor = '#007bff';

  venueSubscription: Subscription;
  commSubscription: Subscription;
  newStandSubscription: Subscription;

  stands: [Stand];
  newStand: Stand;
  on = false;

  startingPoint: { x: number, y: number };

  cx: CanvasRenderingContext2D;
  canvasEventsSubscription: Subscription;

  constructor(
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit(): void {
    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => this.stands = venue.stands);

    this.commSubscription = this.canvasService.getCommunicationSubject()
      .subscribe((communication: CanvasCommunication) => {
        switch (communication.state) {
          case CanvasState.SETUP:
            this.setup();
            this.drawStands();
            break;

          case CanvasState.ON:
            if (this.cx) {
              this.on = true;
              this.start();
            }
            break;

          case CanvasState.OFF:
            if (this.cx) {
              this.on = false;
              this.stop();
            }
            break;

          case CanvasState.REVERT:
            if (this.cx) {
              this.on = false;
              this.clearCanvas();
              communication.selectedStand !== undefined
                ? this.drawStands(communication.selectedStand)
                : this.drawStands();
            }
            break;

          case CanvasState.CLEAR:
            if (this.cx) {
              this.on = false;
              this.clearCanvas();
            }
            break;
        }
      });
  }

  ngOnDestroy() {
    this.venueSubscription.unsubscribe();
    this.commSubscription.unsubscribe();
  }

  drawStands(selected?: number) {
    const stands = this.stands.map(stand => {
      return <Stand>{
        id: stand.id,
        topLeft: this.convertPosToAbsolute(stand.topLeft),
        bottomRight: this.convertPosToAbsolute(stand.bottomRight)
      };
    });

    for (const stand of stands) {
      const pos1 = stand.topLeft;
      const pos2 = stand.bottomRight;

      if (selected !== undefined && selected === stand.id) {
        this.cx.strokeStyle = this.selectedColor;
      } else {
        this.cx.strokeStyle = this.defaultColor;
      }
      this.drawRect(pos1, pos2);
    }
  }

  setup() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.canvas.nativeElement.offsetWidth;
    canvasEl.height = this.canvas.nativeElement.offsetHeight;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#00386f';
  }

  stop() {
    this.canvasEventsSubscription.unsubscribe();
  }

  start() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.canvasEventsSubscription = fromEvent(canvasEl, 'mousedown')
      .pipe(
      tap(start => this.captureFirstPoint(canvasEl, start)),
      switchMap(e => {
        return fromEvent(canvasEl, 'mousemove')
          .pipe(
          takeUntil(fromEvent(canvasEl, 'mouseup').pipe(
            tap(end => this.captureLastPoint(canvasEl, end))
          )),
          takeUntil(fromEvent(canvasEl, 'mouseleave').pipe(
            tap(end => this.captureLastPoint(canvasEl, end))
          ))
          );
      })
      ).subscribe((mouse: MouseEvent) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const currentPos = {
          x: mouse.clientX - rect.left,
          y: mouse.clientY - rect.top
        };

        this.drawNewRect(this.startingPoint, currentPos);
      });
  }

  captureFirstPoint(canvasEl: HTMLCanvasElement, event: Event) {
    const mouse: MouseEvent = <MouseEvent>event;
    const rect = canvasEl.getBoundingClientRect();

    const pos = {
      x: mouse.clientX - rect.left,
      y: mouse.clientY - rect.top
    };

    this.startingPoint = pos;
  }

  captureLastPoint(canvasEl: HTMLCanvasElement, event: Event) {
    const mouse: MouseEvent = <MouseEvent>event;
    const rect = canvasEl.getBoundingClientRect();

    const pos = {
      x: mouse.clientX - rect.left,
      y: mouse.clientY - rect.top
    };

    const stand: Stand = new Stand({
      pos1: this.convertPosToRelative(this.startingPoint),
      pos2: this.convertPosToRelative(pos)
    });

    this.canvasService.addNewStand(stand);
  }

  clearCanvas() {
    this.cx.clearRect(
      0, 0,
      this.canvas.nativeElement.offsetWidth, this.canvas.nativeElement.offsetHeight
    );
  }

  drawNewRect(
    pos1: { x: number, y: number },
    pos2: { x: number, y: number }
  ) {
    this.clearCanvas();
    this.drawStands();
    this.drawRect(pos1, pos2);
  }

  drawRect(
    pos1: { x: number, y: number },
    pos2: { x: number, y: number }
  ) {
    // incase the context is not set
    if (!this.cx) { return; }

    // start our drawing path
    this.cx.beginPath();

    // we're drawing lines so we need a previous position
    this.cx.moveTo(pos1.x, pos1.y);

    // draws a line from the start pos until the current position
    this.cx.lineTo(pos2.x, pos1.y);
    this.cx.lineTo(pos2.x, pos2.y);
    this.cx.lineTo(pos1.x, pos2.y);
    this.cx.lineTo(pos1.x, pos1.y);

    // strokes the current path with the styles we set earlier
    this.cx.stroke();
  }

  convertPosToRelative(pos: { x: number, y: number }) {
    const w = this.canvas.nativeElement.offsetWidth;
    const h = this.canvas.nativeElement.offsetHeight;

    return { x: pos.x / w, y: pos.y / h };
  }

  convertPosToAbsolute(pos: { x: number, y: number }) {
    const w = this.canvas.nativeElement.offsetWidth;
    const h = this.canvas.nativeElement.offsetHeight;

    return { x: pos.x * w, y: pos.y * h };
  }
}
