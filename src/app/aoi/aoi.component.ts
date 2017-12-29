import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-aoi',
  templateUrl: './aoi.component.html',
  styleUrls: ['./aoi.component.css']
})

export class AoiComponent implements OnInit {
  message:string = "select an area of interest...";
  private _aoi = 'no area selected';
  
  @Output() activateDraw: EventEmitter<null> = new EventEmitter();
  @Output() resetDraw: EventEmitter<null> = new EventEmitter();

  @Input() drawingActive:boolean;

  @Input() set aoi(value:any) {
    //value is null until first AOI box is drawn
    if (value) {
      //compute output string here since this is called once and the getter is called frequently
      this._aoi = `${value.xmin.toFixed(3)}, ${value.ymin.toFixed(3)}, ${value.xmax.toFixed(3)}, ${value.ymax.toFixed(3)}`;
    }
  }

  buttonResetHandler() {
    this.resetDraw.emit();
    this._aoi = 'no area selected';
  }

  buttonClickHandler() {
    this.activateDraw.emit();
  }

  //TODO: why is this called constantly?
  get aoi() {
    return(this._aoi);
  }


  constructor() { }


  ngOnInit() { }

}
