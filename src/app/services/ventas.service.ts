import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Venta } from '../Models/modeloVenta';
import { VentaDetalle } from '../Models/modeloVentaDetalle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  ruta: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    environment.api;
    this.ruta = environment.api;
  }

  bearer: string = 'Bearer ' + this.cookieService.get('token');

  header = {
    'content-type': 'application/json',
    Authorization: this.bearer,
  };

  getVentasByFilial(rucFilial: string): Observable<any> {
    return this.http.get<Venta[]>(
      `${this.ruta}ReservaProductos/ventasFilial/${rucFilial}`,
      {
        headers: this.header,
      }
    );
  }

  getVentasByProfesional(documentoProfesional: string): Observable<any> {
    return this.http.get<Venta[]>(
      `${this.ruta}ReservaProductos/ventasProfesional/${documentoProfesional}`,
      {
        headers: this.header,
      }
    );
  }

  getVentasCliente(
    documentoCliente: string,
    documentoProfesional: string,
    rucFilial: string
  ): Observable<any> {
    return this.http.get<Venta[]>(
      `${this.ruta}/ReservaProductos/comprasCliente/${documentoCliente}/${documentoProfesional}/${rucFilial}`,
      {
        headers: this.header,
      }
    );
  }

  getVentasEmpresa(
    rucEmpresa: string,
    documentoProfesional: string,
    rucFilial: string
  ): Observable<any> {
    return this.http.get<Venta[]>(
      `${this.ruta}/ReservaProductos/comprasEmpresa/${rucEmpresa}/${documentoProfesional}/${rucFilial}`,
      {
        headers: this.header,
      }
    );
  }

  getDetallesVentas(codigoVenta: string): Observable<any> {
    return this.http.get<VentaDetalle[]>(
      `${this.ruta}OrdenReserva/detallesCompra//${codigoVenta}`,
      {
        headers: this.header,
      }
    );
  }

  getVentaByCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.ruta}ReservaProductos/${codigo}`, {
      headers: this.header,
    });
  }

  deleteVenta(codigo: string): any {
    return this.http.delete(`${this.ruta}ReservaProductos/${codigo}`, {
      headers: this.header,
    });
  }
}
