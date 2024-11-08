import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-start-up',
  templateUrl: './start-up.component.html',
  styleUrls: ['./start-up.component.css']
})
export class StartUpComponent implements OnInit {
  logueado:boolean;
  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    if (this.cookieService.check('token')) {
      this.logueado = true;
    } else {
      this.logueado = false;
    }
  }

}
