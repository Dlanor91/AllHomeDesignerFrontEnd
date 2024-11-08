import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Sucursal } from '../Models/modeloSucursal';
import { SucursalUpdate } from '../Models/modeloSucursalUpdate';
import { RegistroSucursalRequest } from '../interfaces/registro_sucursal_request ';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  ruta: string;
  rucFilial: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    environment.api;
    this.ruta = environment.api;
    this.rucFilial = this.cookieService.get('rucFilial');
  }

  bearer: string = 'Bearer ' + this.cookieService.get('token');

  header = {
    'content-type': 'application/json',
    Authorization: this.bearer,
  };

  //#region Extrae información desde la API

  getSucursales(): Observable<any> {
    return this.http.get<Sucursal[]>(`${this.ruta}Sucursal`, {
      headers: this.header,
    });
  }

  getSucursalByCodigo(codigo: string): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.ruta}Sucursal/${codigo}`, {
      headers: this.header,
    });
  }

  getSucursalesByRuc(): Observable<any> {
    return this.http.get(`${this.ruta}Sucursal/GetAllByRuc/${this.rucFilial}`, {
      headers: this.header,
    });
  }

  postSucursalPorRucFilial(
    rucFilial: string,
    modelo: RegistroSucursalRequest
  ): Observable<any> {
    return this.http.post(`${this.ruta}Sucursal/${rucFilial}`, modelo, {
      headers: this.header,
    });
  }

  updateSucursal(sucursalModificada: SucursalUpdate, codigo: string): any {
    return this.http.put(`${this.ruta}Sucursal/${codigo}`, sucursalModificada, {
      headers: this.header,
    });
  }

  deleteSucursal(codigo: string): any {
    return this.http.delete(`${this.ruta}Sucursal/${codigo}`, {
      headers: this.header,
    });
  }

  //#endregion
}
