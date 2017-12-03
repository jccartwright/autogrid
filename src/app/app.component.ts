import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AutoGrid';
  aoi:string;

  aoiHandler(event:string) {
    this.aoi = event;
    console.log('event: ',event);
  }

}
