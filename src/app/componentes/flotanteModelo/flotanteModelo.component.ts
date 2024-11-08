import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'flotanteModelo',
  templateUrl: './flotanteModelo.component.html',
  styleUrls: ['./flotanteModelo.component.css'],
})
export class flotanteModeloComponent implements OnInit {
  rol: string;
  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.rol = this.cookieService.get('rol');
  }

  irModelo(): void {
    window.location.href = '/maquetas';
  }

  irAProductos(): void {
    window.location.href = '/Productos';
  }
}
