import { Component, ViewChild } from '@angular/core';
import { EsriMapComponent } from './esri-map/esri-map.component';

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

  @ViewChild(EsriMapComponent) mapComponent: EsriMapComponent;

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

  setAoiOnMapHandler(bbox) {
    this.mapComponent.repositionMap(bbox);
    //console.log('inside setAoiOnMapHandler with ',bbox);
  }
}
