import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { AutogridService } from '../autogrid.service';

// also import "esri-loader" methods to be able to load JSAPI modules
// loadScript is optional if always using the latest JSAPI 4.x version
import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  @Output() aoi: EventEmitter<any> = new EventEmitter();

  drawRectangleSubscription: any;
  resetDrawSubscription: any;

  // for JSAPI 4.x you can use the 'any' for TS types
  public mapView: __esri.MapView;
  public fillSymbol: any; // autocast not allow type of __esri.FillSymbol?
  public extentGraphic: __esri.Graphic;

  private _drawHandle;

  // make the loaded JSAPI classes available to all methods
  private Graphic;
  private Extent;
  private webMercatorUtils;
  private Map;
  private MapView;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(private autogridService: AutogridService) {}

  activateDraw() {
    if (this.extentGraphic) {
      this.mapView.graphics.remove(this.extentGraphic);
    }
    this._drawHandle = this._setDrawHandler();
  }


  resetDraw() {
    if (this.extentGraphic) { this.mapView.graphics.remove(this.extentGraphic); }
    if (this._drawHandle) { this._drawHandle.remove(); }
  }


  repositionMap(bbox) {
    this.resetDraw();
    const extent: __esri.Extent = new this.Extent({
      xmin: bbox.minx,
      ymin: bbox.miny,
      xmax: bbox.maxx,
      ymax: bbox.maxy,
      spatialReference: {
        wkid: 4326
      }});

    this.extentGraphic = new this.Graphic({
      geometry: extent,
      symbol: this.fillSymbol
    });
    this.mapView.graphics.add(this.extentGraphic);

    // TODO need to zoom out by 1 level
    this.mapView.goTo(extent);
  }

  private _setFillSymbol() {
    // Create a symbol for rendering the graphic
    this.fillSymbol = {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [227, 139, 79, 0.8],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1
      }
    };
  }


  private _constructMap() {
    const map: __esri.Map = new this.Map({
      basemap: 'oceans'
    });

    this.mapView = new this.MapView({
      // create the map view at the DOM element in this component
      container: this.mapViewEl.nativeElement,
      center: [0, 0],
      zoom: 2,
      map // property shorthand for object literal
    });
  }


  private _setDrawHandler() {
    // Thanks to Thomas Solow (https://community.esri.com/thread/203242-draw-a-rectangle-in-jsapi-4x)
    let extentGraphic: __esri.Graphic = null;
    let origin = null;

    const handler = this.mapView.on('drag', e => {
      e.stopPropagation();
      if (e.action === 'start') {
        if (extentGraphic) {this.mapView.graphics.remove(extentGraphic); }
        origin = this.mapView.toMap(e);
      } else if (e.action === 'update') {
        // fires continuously during drag
        if (extentGraphic) { this.mapView.graphics.remove(extentGraphic); }
        const p: __esri.Point = this.mapView.toMap(e);
        extentGraphic = new this.Graphic({
          geometry: new this.Extent({
            xmin: Math.min(p.x, origin.x),
            xmax: Math.max(p.x, origin.x),
            ymin: Math.min(p.y, origin.y),
            ymax: Math.max(p.y, origin.y),
            spatialReference: { wkid: 102100 }
          }),
          symbol: this.fillSymbol
        });
        this.mapView.graphics.add(extentGraphic);
      } else if (e.action === 'end') {
        this.autogridService.drawRectangleComplete(this.webMercatorUtils.webMercatorToGeographic(extentGraphic.geometry));
        this.extentGraphic = extentGraphic;
        this.aoi.emit(this.webMercatorUtils.webMercatorToGeographic(extentGraphic.geometry));
        // console.log(extentGraphic.geometry.toJSON());

        // remove the handler so map panning will work when not drawing
        handler.remove();
        this._drawHandle = null;
      }
    });
    return handler;
  }


  // TODO any concern w/ putting all logic w/in the init lifecycle handler?
  public ngOnInit() {
    this.drawRectangleSubscription = this.autogridService.drawRequest.subscribe(() => {
      this.activateDraw();
    });
    this.resetDrawSubscription = this.autogridService.resetDrawRequest.subscribe(() => {
      this.resetDraw();
    });

    // only load the ArcGIS API for JavaScript when this component is loaded
    return loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/geometry/Extent',
      'esri/geometry/support/webMercatorUtils'
    ], {
      url: 'https://js.arcgis.com/4.6/'
    }).then(([
        Map,
        MapView,
        Graphic,
        Extent,
        webMercatorUtils
      ]) => {
        // make the loaded JSAPI classes available to all methods. facilitates
        // separating JSAPI functionality out into smaller methods
        this.Graphic = Graphic;
        this.Extent = Extent;
        this.webMercatorUtils = webMercatorUtils;
        this.Map = Map;
        this.MapView = MapView;

        this._setFillSymbol();

        this._constructMap();
      });
  }

}
