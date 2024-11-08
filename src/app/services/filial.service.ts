import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { RegistroFilialesRequest } from '../interfaces/registro_filiales';
import { FilialUpdate } from '../Models/modeloFilialUpdate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilialService {
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

  getFilial(): Observable<any> {
    return this.http.get(`${this.ruta}Filial`, { headers: this.header });
  }

  getFilialByRuc(ruc: string): Observable<any> {
    return this.http.get(`${this.ruta}Filial/${ruc}`, {
      headers: this.header,
    });
  }

  registroFilial(modelo: RegistroFilialesRequest): Observable<any> {
    return this.http.post(`${this.ruta}Filial`, modelo, {
      headers: this.header,
    });
  }

  updateFilial(filialModificada: FilialUpdate, ruc: string): any {
    return this.http.put(`${this.ruta}Filial/${ruc}`, filialModificada, {
      headers: this.header,
    });
  }

  deleteFilial(ruc: string): any {
    return this.http.delete(`${this.ruta}Filial/${ruc}`, {
      headers: this.header,
    });
  }

  //#endregion
}
