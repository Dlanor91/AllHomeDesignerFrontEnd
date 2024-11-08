import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor(private SpinnerService: NgxSpinnerService) {}

  public llamarSpinner() {
    this.SpinnerService.show();
  }

  public detenerSpinner() {
    this.SpinnerService.hide();
  }
}
