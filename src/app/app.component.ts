import { Component, HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProyFrontEnd';
/*
  constructor(private cookieService: CookieService){}

  @HostListener('window:beforeunload')
  onBeforeUnload(){
    this.cookieService.delete('token');

  }
  */
}

