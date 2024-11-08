import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { TipoUsuario } from '../Models/modeloTipoUsuario';
import { RegistroTipoUsuarioRequest } from '../interfaces/registro_tipo_usuario_request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoUsuarioService {
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

  getTiposUsuarios(): Observable<TipoUsuario[]> {
    return this.http.get<TipoUsuario[]>(`${this.ruta}TipoUsuario`, {
      headers: this.header,
    });
  }

  getTipoUsuarioById(id: number): Observable<any> {
    return this.http.get(`${this.ruta}TipoUsuario/${id}`, {
      headers: this.header,
    });
  }

  updateTipoUsuario(tipoUsuarioModificar: TipoUsuario, id: number): any {
    return this.http.put(
      `${this.ruta}TipoUsuario/${id}`,
      tipoUsuarioModificar,
      {
        headers: this.header,
      }
    );
  }

  deleteTipoUsuario(id: number): any {
    return this.http.delete(`${this.ruta}TipoUsuario/${id}`, {
      headers: this.header,
    });
  }

  registrarTipoUsuario(modelo: RegistroTipoUsuarioRequest): Observable<any> {
    return this.http.post(`${this.ruta}TipoUsuario/`, modelo, {
      headers: this.header,
    });
  }

  //#endregion
}
