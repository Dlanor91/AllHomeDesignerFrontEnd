import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  logueado: boolean;
  nombre: string;
  rol: string;
  codigoSucursal: string;
  rucFilial: string;

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    if (this.cookieService.check('token')) {
      this.logueado = true;
      this.nombre = this.cookieService.get('nombreCompleto');
      this.rol = this.cookieService.get('rol');
      this.rucFilial = this.cookieService.get('rucFilial');
      this.codigoSucursal = this.cookieService.get('codigoSucursal');
    } else {
      this.logueado = false;
    }
  }
}
