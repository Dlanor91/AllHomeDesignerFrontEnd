import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Proveedor } from '../Models/modeloProveedor';
import { ProveedorUpdate } from '../Models/modeloProveedorUpdate';
import { RegistroProveedor } from '../interfaces/registro_proveedor_request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
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

  //Extrae información desde la API
  getProveedor(): Observable<any> {
    return this.http.get<Proveedor[]>(`${this.ruta}Proveedor`, {
      headers: this.header,
    });
  }

  getProveedorById(ruc: string): Observable<any> {
    return this.http.get(`${this.ruta}Proveedor/${ruc}`, {
      headers: this.header,
    });
  }

  registrarProveedor(modelo: RegistroProveedor): Observable<any> {
    return this.http.post(`${this.ruta}Proveedor/`, modelo, {
      headers: this.header,
    });
  }

  updateProveedor(proveedorModificado: ProveedorUpdate, ruc: string): any {
    return this.http.put(`${this.ruta}Proveedor/${ruc}`, proveedorModificado, {
      headers: this.header,
    });
  }

  deleteProveedora(ruc: string): any {
    return this.http.delete(`${this.ruta}Proveedor/${ruc}`, {
      headers: this.header,
    });
  }
}
