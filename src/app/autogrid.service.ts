import { Injectable } from '@angular/core';

@Injectable()
export class AutogridService {

  constructor() { }

  //estimate min grid cell size based on AOI and max number of grid cells
  calculateGridSize(bbox) {
    //TODO
    return(100);
  }
}
