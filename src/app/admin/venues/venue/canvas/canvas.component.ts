import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, SimpleChanges, SimpleChange, Input } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

  constructor() { }

  @ViewChild('canvas') public canvas: ElementRef;

  private stateSubscription: Subscription;
  @Input() state: Observable<boolean>;

  private cx: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.stateSubscription = this.state.subscribe(() => {
      this.start();
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

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
      switchMap((e) => {
        return fromEvent(canvasEl, 'mousemove')
          .pipe(
          takeUntil(fromEvent(canvasEl, 'mouseup')),
          takeUntil(fromEvent(canvasEl, 'mouseleave')),
          pairwise()
          );
      })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(
    prevPos: { x: number, y: number },
    currentPos: { x: number, y: number }
  ) {
    // incase the context is not set
    if (!this.cx) { return; }

    // start our drawing path
    this.cx.beginPath();

    // we're drawing lines so we need a previous position
    if (prevPos) {
      // sets the start point
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      // draws a line from the start pos until the current position
      this.cx.lineTo(currentPos.x, currentPos.y);

      // strokes the current path with the styles we set earlier
      this.cx.stroke();
    }
  }

}
