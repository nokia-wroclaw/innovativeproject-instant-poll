import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImageDialogComponent } from './image-dialog.component';

@Injectable()
export class ImageDialogService {

  constructor(private modalService: NgbModal) { }

  public show(
    title: string,
    message: string): Promise<boolean> {
    const modalRef = this.modalService.open(ImageDialogComponent, { size: "lg" });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    return modalRef.result;
  }

}