import { Injectable } from '@angular/core';
import { Producto } from '../Models/modeloProducto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ImagenesProductos } from '../Models/modeloImagenesProducto';
import { ProductoRequest } from '../interfaces/producto-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosServices {
  ruta: string;
  api: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    environment.api;
    this.ruta = environment.api;
  }

  bearer: string = 'Bearer ' + this.cookieService.get('token');

  header = {
    'content-type': 'application/json',
    Authorization: this.bearer,
  };

  //Obtengo todos los productos de la API
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.ruta}Producto`, {
      headers: this.header,
    });
  }

  getProductosByFilial(rucFilial: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.ruta}Producto/${rucFilial}`, {
      headers: this.header,
    });
  }

  //Obtengo información de un producto
  getProductoByCodigo(
    codigo: string,
    rucProveedor: string
  ): Observable<Producto> {
    return this.http.get<Producto>(
      `${this.ruta}Producto/${codigo}/${rucProveedor}`,
      {
        headers: this.header,
      }
    );
  }

  registrarProducto(
    modelo: ProductoRequest,
    rucFilial: string
  ): Observable<any> {
    return this.http.post(`${this.ruta}Producto/${rucFilial}`, modelo, {
      headers: this.header,
    });
  }

  //Eliminar todos los productos por una categoria
  deleteAllProductosByIdCategoria(idCategoria: number): any {
    return this.http.delete(
      `${this.ruta}Producto/borrarTodosProductosCategoria/${idCategoria}`,
      { headers: this.header }
    );
  }

  deleteProducto(codigo: string, rucProveedor: string): any {
    return this.http.delete(`${this.ruta}Producto/${codigo}/${rucProveedor}`, {
      headers: this.header,
    });
  }
}
