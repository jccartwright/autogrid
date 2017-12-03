import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { HeaderComponent } from './header/header.component';
import { AoiComponent } from './aoi/aoi.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    HeaderComponent,
    AoiComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule
  ],
  providers: [EsriLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
