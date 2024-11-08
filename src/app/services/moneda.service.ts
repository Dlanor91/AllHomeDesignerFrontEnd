import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { MonedaUpdate } from '../Models/modeloMonedaUpdate';
import { RegistroMoneda } from '../interfaces/registro_moneda_request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MonedaService {
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

  //#region Extrae información desde la API

  getMonedas(): Observable<any> {
    return this.http.get(`${this.ruta}Moneda`, { headers: this.header });
  }

  getMonedaById(codigo: string): Observable<any> {
    return this.http.get(`${this.ruta}Moneda/${codigo}`, {
      headers: this.header,
    });
  }

  updateMoneda(monedaModificada: MonedaUpdate, codigo: string): any {
    return this.http.put(`${this.ruta}Moneda/${codigo}`, monedaModificada, {
      headers: this.header,
    });
  }

  deleteCategoria(codigo: string): any {
    return this.http.delete(`${this.ruta}Moneda/${codigo}`, {
      headers: this.header,
    });
  }

  registroMoneda(modelo: RegistroMoneda): Observable<any> {
    return this.http.post(`${this.ruta}Moneda/`, modelo, {
      headers: this.header,
    });
  }

  //#endregion
}
