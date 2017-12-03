import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aoi',
  templateUrl: './aoi.component.html',
  styleUrls: ['./aoi.component.css']
})
export class AoiComponent implements OnInit {
  message:string = "select an area of interest...";
  private _aoi:string;

  @Input() set aoi(value:string) {
    this._aoi = value;
    console.log('inside setAoi with ',value);

  }

  get aoi(): string {
    console.log('inside getter');
    return this._aoi;
  }



  constructor() { }

  ngOnInit() {
  }

}
