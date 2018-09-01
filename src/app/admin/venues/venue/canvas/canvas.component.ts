import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, SimpleChanges, SimpleChange, Input } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

  constructor() { }

  @ViewChild('canvas') public canvas: ElementRef;

  stateSubscription: Subscription;
  @Input() state: Observable<boolean>;

  cx: CanvasRenderingContext2D;
  canvasEventsSubscription: Subscription;

  ngOnInit(): void {
    this.stateSubscription = this.state.subscribe((canBeEdited: boolean) => {
      canBeEdited ? this.start() : this.stop();
    });
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }

  start() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.canvas.nativeElement.offsetWidth;
    canvasEl.height = this.canvas.nativeElement.offsetHeight;

    // set some default properties about the line
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    // we'll implement this method to start capturing mouse events
    this.captureEvents(canvasEl);
  }

  stop() {
    this.canvasEventsSubscription.unsubscribe();
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    let startPosition: { x: number, y: number };
    this.canvasEventsSubscription = fromEvent(canvasEl, 'mousedown')
      .pipe(
      tap(start => {
        const mouse: MouseEvent = <MouseEvent>start;
        const rect = canvasEl.getBoundingClientRect();

        const pos = {
          x: mouse.clientX - rect.left,
          y: mouse.clientY - rect.top
        };

        startPosition = pos;
      }),
      switchMap(e => {
        return fromEvent(canvasEl, 'mousemove')
          .pipe(
          takeUntil(fromEvent(canvasEl, 'mouseup')),
          takeUntil(fromEvent(canvasEl, 'mouseleave'))
          );
      })
      ).subscribe((mouse: MouseEvent) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const currentPos = {
          x: mouse.clientX - rect.left,
          y: mouse.clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawRectOnCanvas(startPosition, currentPos);
      });
  }

  private drawRectOnCanvas(
    pos1: { x: number, y: number },
    pos2: { x: number, y: number }
  ) {
    // incase the context is not set
    if (!this.cx) { return; }

    this.cx.clearRect(0, 0, this.canvas.nativeElement.offsetWidth, this.canvas.nativeElement.offsetHeight);

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

}
