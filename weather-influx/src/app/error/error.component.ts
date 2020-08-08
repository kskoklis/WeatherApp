import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  // message = 'An unknow error occured!';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

  ngOnInit() {
  }

}
