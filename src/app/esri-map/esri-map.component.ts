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

  // for JSAPI 4.x you can use the 'any' for TS types
  public mapView: any;
  public fillSymbol: any;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;


  constructor( private esriLoader: EsriLoaderService) { }


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


  private _constructMap(Map, MapView) {
    const mapProperties: any = {
      basemap: 'hybrid'
    };

    const map: any = new Map(mapProperties);

    const mapViewProperties: any = {
      // create the map view at the DOM element in this component
      container: this.mapViewEl.nativeElement,
      // supply additional options
      center: [-12.287, -37.114],
      zoom: 12,
      map // property shorthand for object literal
    };

    this.mapView = new MapView(mapViewProperties);
  }


  private _setDrawHandler(Graphic, Extent) {
    //Thanks to Thomas Solow (https://community.esri.com/thread/203242-draw-a-rectangle-in-jsapi-4x)
    this._setFillSymbol();
    
    let extentGraphic = null;
    let origin = null;

    let handler = this.mapView.on('drag', e => {
      e.stopPropagation();
      if (e.action === 'start'){
        if (extentGraphic) this.mapView.graphics.remove(extentGraphic)
        origin = this.mapView.toMap(e);
      } else if (e.action === 'update'){
        if (extentGraphic) this.mapView.graphics.remove(extentGraphic)
        let p = this.mapView.toMap(e); 
        extentGraphic = new Graphic({
          geometry: new Extent({
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
        this.aoi.emit(extentGraphic.geometry.toJSON());
        console.log(extentGraphic.geometry.toJSON());    
      }
    });
    return handler;
  }
  

  //TODO any issue w/ putting all logic w/in the init lifecycle handler?
  public ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      url: 'https://js.arcgis.com/4.5/'
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Extent'
      ]).then(([
        Map,
        MapView,
        Graphic,
        Extent
      ]) => {

        this._constructMap(Map, MapView);
        this._setDrawHandler(Graphic, Extent);

        // var handle = this.mapView.watch('extentGraphic', function(newValue, oldValue, property, object){
        //   //oldValue is null when watch first fires
        //   console.log("New value: ", newValue.xmin);
        // });
      });
    });
  }

}