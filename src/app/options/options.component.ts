import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  formData = {
    "cellSize": null,
    "backgroundFill": false,
    "mapTitle": "AutoGrid Map",
    "colorTable": "rainbow"

  }

  colorTables = [
    {value: 'rainbow', viewValue: 'GMT_rainbow.png'},
    {value: 'sealand', viewValue: 'GMT_sealand.png'},
    {value: 'gebco', viewValue: 'GMT_gebco.png'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
