import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  @Output() aoi: EventEmitter<any> = new EventEmitter();
  @Output() drawingActive: EventEmitter<boolean> = new EventEmitter<boolean>();

  // for JSAPI 4.x you can use the 'any' for TS types
  public mapView: any;
  public fillSymbol: any;
  public extentGraphic: any;
  private _drawHandle;

  //TODO bit of a hack but didn't know a better way to expose the JSAPI classes
  private Graphic: any;
  private Extent: any;
  private webMercatorUtils: any;
  private Map: any;
  private MapView: any;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;


  constructor( private esriLoader: EsriLoaderService) { }

  activateDraw() {
    this.drawingActive.emit(true);
    if (this.extentGraphic) {
      this.mapView.graphics.remove(this.extentGraphic);
    }
    this._drawHandle = this._setDrawHandler();
  }

  resetDraw() {
    if (this.extentGraphic) this.mapView.graphics.remove(this.extentGraphic)
    this.drawingActive.emit(false);
    if (this._drawHandle) { this._drawHandle.remove(); }
  }

  private _setFillSymbol() {
    // Create a symbol for rendering the graphic
    this.fillSymbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [227, 139, 79, 0.8],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1
      }
    };
  }


  private _constructMap() {
    const mapProperties: any = {
      basemap: 'hybrid'
    };

    const map: any = new this.Map(mapProperties);

    const mapViewProperties: any = {
      // create the map view at the DOM element in this component
      container: this.mapViewEl.nativeElement,
      // supply additional options
      center: [-12.287, -37.114],
      zoom: 12,
      map // property shorthand for object literal
    };

    this.mapView = new this.MapView(mapViewProperties);
  }


  private _setDrawHandler() {
    //Thanks to Thomas Solow (https://community.esri.com/thread/203242-draw-a-rectangle-in-jsapi-4x)
    this._setFillSymbol();
    
    let extentGraphic = null;
    let origin = null;

    let handler = this.mapView.on('drag', e => {
      e.stopPropagation();
      if (e.action === 'start'){
        //this.drawingActive.emit(true);
        if (extentGraphic) this.mapView.graphics.remove(extentGraphic)
        origin = this.mapView.toMap(e);
      } else if (e.action === 'update'){
        //fires continuously during drag
        if (extentGraphic) this.mapView.graphics.remove(extentGraphic)
        let p = this.mapView.toMap(e); 
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
        this.mapView.graphics.add(extentGraphic)
      } else if (e.action == 'end') {
        this.drawingActive.emit(false);
        this.extentGraphic = extentGraphic;
        this.aoi.emit(this.webMercatorUtils.webMercatorToGeographic(extentGraphic.geometry));
        //console.log(extentGraphic.geometry.toJSON());

        //remove the handler so map panning will work when not drawing
        handler.remove();
        this._drawHandle = null; 
      }
    });
    return handler;
  }
  

  //TODO any concern w/ putting all logic w/in the init lifecycle handler?
  public ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      url: 'https://js.arcgis.com/4.5/'
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Extent',
        "esri/geometry/support/webMercatorUtils"
      ]).then(([
        Map,
        MapView,
        Graphic,
        Extent,
        webMercatorUtils
      ]) => {
        this.Graphic = Graphic;
        this.Extent = Extent;
        this.webMercatorUtils = webMercatorUtils;
        this.Map = Map;
        this.MapView = MapView;

        this._constructMap();
        
      });
    });
  }

}