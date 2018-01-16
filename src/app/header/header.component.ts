import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'autogrid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() version: string;
  
  openDialog(): void {
    let dialogRef = this.dialog.open(InfoDialog, {
      width: '750px',
      height: '500px',
      data: {'version': this.version }
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });  
  }

  constructor(public dialog: MatDialog ) { }

  ngOnInit() {
  }

}


@Component({
  selector: 'info-dialog',
  templateUrl: 'info-dialog.html',
})
export class InfoDialog {

  constructor(public dialogRef: MatDialogRef<InfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  okButtonHandler() {
    this.dialogRef.close();
  }

}