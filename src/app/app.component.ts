import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { OptionsComponent } from './options/options.component';
import { AoiComponent } from './aoi/aoi.component';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * this class serves as a mediator between sibling components
 */
export class AppComponent {
  title = 'AutoGrid';
  aoi;
  drawingActive = false;
  email: string;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);

  @ViewChild(EsriMapComponent) mapComponent: EsriMapComponent;
  @ViewChild(OptionsComponent) optionsComponent: OptionsComponent;
  @ViewChild(AoiComponent) aoiComponent: AoiComponent;

  drawingActiveHandler(event) {
    this.drawingActive = event;
  }

  //receives output from draw on map
  aoiHandler(event) {
    this.aoi = event;
  }

  //receives output from draw button click in AoiComponent
  activateDrawHandler(event) {
    this.mapComponent.activateDraw();
  }

  //receives output from reset button click in AoiComponent
  resetDraw(event) {
    this.mapComponent.resetDraw();
  }

  //update map from coordinate dialog input
  setAoiOnMapHandler(bbox) {
    this.mapComponent.repositionMap(bbox);
  }

  submitRequest() {
    let formData = this.optionsComponent.formData;
    formData["bbox"] = this.aoiComponent.aoi;
    formData["email"] = this.emailFormControl.value;
    console.log(formData);
  }
}
