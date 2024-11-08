import { Injectable } from '@angular/core';
import { Compra } from '../Models/modeloCompra';
import { OrdenReserva } from '../Models/modeloOrdenReserva';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private compras: Compra[] = [];
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

  getCarrito(): Compra[] {
    return this.compras;
  }

  setCarrito(compras: any[]): void {
    this.compras = compras;
  }

  guardarEnLocalStorage(): void {
    const comprasCarrito = this.getCarrito();
    const miCarrito = JSON.stringify(comprasCarrito);
    localStorage.setItem('miCarrito', miCarrito);
  }

  eliminarLocalStorage(): void {
    localStorage.removeItem('miCarrito');
    this.compras = [];
  }

  //Genero la orden de compra
  generarOrdenReservaCliente(
    documentoCliente: string,
    rucFilial: string,
    documentoProfesional: string,
    orden: OrdenReserva[]
  ): Observable<any> {
    return this.http.post(
      `${this.ruta}OrdenReserva/reservaProductosCliente/${documentoCliente}/${rucFilial}/${documentoProfesional}`,
      orden,
      {
        headers: this.header,
      }
    );
  }

  generarOrdenReservaEmpresa(
    rucEmpresa: string,
    rucFilial: string,
    documentoProfesional: string,
    orden: OrdenReserva[]
  ): Observable<any> {
    return this.http.post(
      `${this.ruta}OrdenReserva/reservaProductos/Empresa/${rucEmpresa}/${rucFilial}/${documentoProfesional}`,
      orden,
      {
        headers: this.header,
      }
    );
  }
}
