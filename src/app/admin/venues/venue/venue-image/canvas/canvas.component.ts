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

import { CanvasState, CanvasCommunication, Selected } from './canvasCommunication';
import { Stand } from '../../stand';
import { Venue, Availability } from '../../venue';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

  @ViewChild('canvas') public canvas: ElementRef;
  private colors = {
    default: '#00386f',
    selected: '#5ee0ff',
    delete: '#dc2121',
    occupied: '#dc2121',
    free: '#34ca34'
  };

  private venueSubscription: Subscription;
  private availabilitySubscription: Subscription;
  private commSubscription: Subscription;

  private availability: {
    value: Availability,
    selectedDay: number
  };

  private stands: [Stand];
  private pendingStand: Stand;

  private startingPoint: { x: number, y: number };

  private cx: CanvasRenderingContext2D;
  private canvasEventsSubscription: Subscription;

  constructor(
    private venuesService: VenuesService,
    private canvasService: CanvasService
  ) { }

  ngOnInit() {
    this.availability = { value: undefined, selectedDay: undefined };

    this.venueSubscription = this.venuesService.getVenueSubject()
      .subscribe(venue => {
        this.stands = venue.stands;
        this.pendingStand = undefined;

        if (this.cx) {
          this.clearCanvas();
          this.drawStands();
        }
      });

    this.availabilitySubscription = this.venuesService.getAvailabilitySubject()
      .subscribe(availability => {
        if (availability) {
          this.availability.value = availability;
        }
      });

    this.commSubscription = this.canvasService.getCommunicationSubject()
      .subscribe((communication: CanvasCommunication) => {
        switch (communication.state) {
          case CanvasState.SETUP:
            this.setup();
            this.drawStands();
            break;

          case CanvasState.ON:
            if (this.cx) {
              this.cx.strokeStyle = this.colors.default;
              this.start();
            }
            break;

          case CanvasState.OFF:
            if (this.cx) {
              this.stop();
            }
            break;

          case CanvasState.REVERT:
            if (this.cx) {
              this.clearCanvas();
              communication.selected && communication.selected.stand
                ? this.drawStands(communication.selected.stand)
                : this.drawStands();
            }
            break;

          case CanvasState.SELECT_DAY:
            this.availability.selectedDay = communication.selected.day;

            if (this.cx) {
              this.clearCanvas();
              this.drawStands();
            }
            break;

          case CanvasState.SELECT:
            if (this.cx) {
              this.clearCanvas();
              this.drawStand(communication.selected.stand, this.colors.selected);
            }
            break;

          case CanvasState.SELECT_TO_DELETE:
            if (this.cx) {
              this.clearCanvas();
              this.drawStand(communication.selected.stand, this.colors.delete);
            }
            break;

          case CanvasState.CLEAR:
            if (this.cx) {
              this.pendingStand = undefined;
              this.availability = undefined;
              this.clearCanvas();
            }
            break;
        }
      });
  }

  ngOnDestroy() {
    this.canvasService.cancelNewStand();
    this.venueSubscription.unsubscribe();
    this.commSubscription.unsubscribe();
  }

  private drawStand(stand: Stand, color: string) {
    const pos1 = this.convertPosToAbsolute(stand.topLeft);
    const pos2 = this.convertPosToAbsolute(stand.bottomRight);

    this.cx.strokeStyle = color;

    this.drawRect(pos1, pos2);
  }

  private drawStands(selectedStand?: Stand) {
    const stands = this.pendingStand ? this.stands.concat([this.pendingStand]) : this.stands;

    for (const stand of stands) {

      if (selectedStand && selectedStand.id === stand.id) {
        this.drawStand(stand, this.colors.selected);
      } else if (this.availability && this.availability.selectedDay && this.availability.value) {
        const day = this.availability.value.availability.filter(
          d => this.availability.selectedDay
        )[0];

        const free = day.stands.filter(s => s.id === stand.id);

        free ? this.drawStand(stand, this.colors.free)
          : this.drawStand(stand, this.colors.occupied);
      } else {
        this.drawStand(stand, this.colors.default);
      }

    }
  }

  private setup() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.canvas.nativeElement.offsetWidth;
    canvasEl.height = this.canvas.nativeElement.offsetHeight;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = this.colors.default;
  }

  private stop() {
    if (this.canvasEventsSubscription) {
      this.canvasEventsSubscription.unsubscribe();
    }
  }

  private start() {
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

  private captureFirstPoint(canvasEl: HTMLCanvasElement, event: Event) {
    const mouse: MouseEvent = <MouseEvent>event;
    const rect = canvasEl.getBoundingClientRect();

    this.pendingStand = undefined;

    const pos = {
      x: mouse.clientX - rect.left,
      y: mouse.clientY - rect.top
    };

    this.startingPoint = pos;
  }

  private captureLastPoint(canvasEl: HTMLCanvasElement, event: Event) {
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

    this.pendingStand = stand;
    this.canvasService.addNewStand(stand);
  }

  private clearCanvas() {
    this.cx.clearRect(
      0, 0,
      this.canvas.nativeElement.offsetWidth, this.canvas.nativeElement.offsetHeight
    );
  }

  private drawNewRect(
    pos1: { x: number, y: number },
    pos2: { x: number, y: number }
  ) {
    this.clearCanvas();
    this.drawStands();
    this.drawRect(pos1, pos2);
  }

  private drawRect(
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

  private convertPosToRelative(pos: { x: number, y: number }) {
    const w = this.canvas.nativeElement.offsetWidth;
    const h = this.canvas.nativeElement.offsetHeight;

    return { x: pos.x / w, y: pos.y / h };
  }

  private convertPosToAbsolute(pos: { x: number, y: number }) {
    const w = this.canvas.nativeElement.offsetWidth;
    const h = this.canvas.nativeElement.offsetHeight;

    return { x: pos.x * w, y: pos.y * h };
  }
}
