import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { 
  MatToolbarModule, 
  MatButton, 
  MatButtonModule, 
  MatCardModule, 
  MatDialogModule, 
  MatExpansionModule, 
  MatCheckboxModule,   
  MatSelectModule,
  MatInputModule
} from '@angular/material';
// import { MatButton } from '@angular/material/button';
import { AppComponent } from './app.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { HeaderComponent } from './header/header.component';
import { AoiComponent, CoordinateDialog } from './aoi/aoi.component';
import { OptionsComponent } from './options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    HeaderComponent,
    AoiComponent,
    CoordinateDialog,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule
  ],
  entryComponents: [ CoordinateDialog ],
  providers: [EsriLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
