import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AutogridService } from '../autogrid.service';


@Component({
  selector: 'app-aoi',
  templateUrl: './aoi.component.html',
  styleUrls: ['./aoi.component.css']
})

export class AoiComponent implements OnInit {
  message = 'select an area of interest...';
  aoi = 'no area selected';
  private minx: number;
  private miny: number;
  private maxx: number;
  private maxy: number;
  private drawingActive: boolean;

  @Output() setAoiOnMap: EventEmitter<any> = new EventEmitter();
  @Output() bboxUpdated: EventEmitter<any> = new EventEmitter();

  drawCompleteSubscription: any;

  constructor(public dialog: MatDialog, private autogridService: AutogridService) { }

  // this is called regardless of whether AOI is updated via map or dialog where
  // setAoiOnMap is called only when dialog box closes
  setBbox(minx, miny, maxx, maxy) {
    this.minx = minx.toFixed(3);
    this.miny = miny.toFixed(3);
    this.maxx = maxx.toFixed(3);
    this.maxy = maxy.toFixed(3);
    // compute output string here since this is called once and the getter is called frequently
    this.aoi = `${this.minx}, ${this.miny}, ${this.maxx}, ${this.maxy}`;
    this.bboxUpdated.emit({minx: this.minx, miny: this.miny, maxx: this.maxx, maxy: this.maxy});
  }


  openDialog(): void {
      const dialogRef = this.dialog.open(CoordinateDialog, {
        width: '250px',
        data: { minx: this.minx, miny: this.miny, maxx: this.maxx, maxy: this.maxy  }
      });

      dialogRef.afterClosed().subscribe(result => {
        // result is null when dialog is cancelled
        if (result && result.minx && result.miny && result.maxx && result.maxy) {
          // TODO type values coming back from dialog as string
          this.setBbox(parseFloat(result.minx), parseFloat(result.miny),
          parseFloat(result.maxx), parseFloat(result.maxy));
          // TODO add box on map corresponding to new coords and zoom to
          this.setAoiOnMap.emit({minx: this.minx, miny: this.miny, maxx: this.maxx, maxy: this.maxy});
        } else {
          console.log('no result. dialog either cancelled or not all values entered');
        }
      });
  }

  ResetButtonHandler() {
    this.drawingActive = false;
    this.autogridService.resetDraw();
    this.aoi = 'no area selected';
    this.minx = null;
    this.miny = null;
    this.maxx = null;
    this.maxy = null;
  }

  DrawButtonHandler() {
    this.drawingActive = true;
    this.autogridService.drawRectangle();
  }

  ngOnInit() {
    this.drawCompleteSubscription = this.autogridService.drawComplete.subscribe(coords => {
        this.setBbox(coords.xmin, coords.ymin, coords.xmax, coords.ymax);
        this.drawingActive = false;
    });
   }
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

