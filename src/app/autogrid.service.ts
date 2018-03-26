import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AutogridService {

  panRequest = new Subject<void>();
  panComplete = new Subject<void>();
  drawRequest = new Subject<void>();
  constructor() { }

  // estimate min grid cell size based on AOI and max number of grid cells
  calculateGridSize(bbox) {
    // TODO
    return(100);
  }

  drawRectangle() {
    this.drawRequest.next();
  }
}
