import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-image-dialog',
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', [
            style({opacity: 0}),
            animate('1000ms', style({opacity: 1}))
          ]
        ),
        transition(
            ':leave', [
            style({opacity: 1}),
            animate('1000ms', style({opacity: 0}))
            ]
        )
      ]
  ),
],
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
