import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AutogridService {

  drawRequest = new Subject<void>();
  drawComplete = new Subject<any>();
  resetDrawRequest = new Subject<void>();

  constructor() { }

  // estimate min grid cell size based on AOI and max number of grid cells
  calculateGridSize(bbox) {
    // TODO
    return(100);
  }

  drawRectangle() {
    this.drawRequest.next();
  }

  resetDraw() {
    this.resetDrawRequest.next();
  }

  drawRectangleComplete(aoi) {
    this.drawComplete.next(aoi);
  }
}
