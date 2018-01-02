import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-aoi',
  templateUrl: './aoi.component.html',
  styleUrls: ['./aoi.component.css']
})

export class AoiComponent implements OnInit {
  message:string = "select an area of interest...";
  private _aoi = 'no area selected';
  private minx: number;
  private miny: number;
  private maxx: number;
  private maxy: number;
  
  @Output() activateDraw: EventEmitter<null> = new EventEmitter();
  @Output() setAoiOnMap: EventEmitter<any> = new EventEmitter();
  @Output() resetDraw: EventEmitter<null> = new EventEmitter();
  @Input() drawingActive:boolean;
  
  @Input() set aoi(value:any) {
    //value is null until first AOI box is drawn
    if (value) {
      this.minx = value.xmin.toFixed(3);
      this.miny = value.ymin.toFixed(3);
      this.maxx = value.xmax.toFixed(3);
      this.maxy = value.ymax.toFixed(3);
      //compute output string here since this is called once and the getter is called frequently
      this._aoi = `${this.minx}, ${this.miny}, ${this.maxx}, ${this.maxy}`;
    }
  }

  openDialog(): void {
      let dialogRef = this.dialog.open(CoordinateDialog, {
        width: '250px',
        data: { minx: this.minx, miny: this.miny, maxx: this.maxx, maxy: this.maxy  }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        //result is null when dialog is cancelled
        if (result && result.minx && result.miny && result.maxx && result.maxy) {
          //TODO type values coming back from dialog as string
          this.minx = parseFloat(result.minx);
          this.miny = parseFloat(result.miny);
          this.maxx = parseFloat(result.maxx);
          this.maxy = parseFloat(result.maxy);
          this._aoi = `${this.minx}, ${this.miny}, ${this.maxx}, ${this.maxy}`;
          //TODO add box on map corresponding to new coords and zoom to
          this.setAoiOnMap.emit({minx: this.minx, miny: this.miny, maxx: this.maxx, maxy: this.maxy});
//          this.resetDraw.emit();
          console.log(result);
        } else {
          console.log("no result. dialog either cancelled or not all values entered");
        }
      });
  }

  buttonResetHandler() {
    this.resetDraw.emit();
    this._aoi = 'no area selected';
    this.minx = null;
    this.miny = null;
    this.maxx = null;
    this.maxy = null;
  }

  buttonClickHandler() {
    this.activateDraw.emit();
  }

  //TODO: why is this called constantly?
  get aoi() {
    return(this._aoi);
  }


  constructor(public dialog: MatDialog) { }


  ngOnInit() { }

}


@Component({
  selector: 'coordinate-dialog',
  templateUrl: 'coordinate-dialog.html',
})
export class CoordinateDialog {

  constructor(
    public dialogRef: MatDialogRef<CoordinateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

