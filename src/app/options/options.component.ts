import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  colorTableControl = new FormControl();
  
  colorTables = [
    {value: 'rainbow', viewValue: 'GMT_rainbow.png'},
    {value: 'sealand', viewValue: 'GMT_sealand.png'},
    {value: 'gebco', viewValue: 'GMT_gebco.png'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
