import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { TipoUsuarioPrivilegio } from '../Models/modeloTipoUsuarioPrivilegio';
import { RegistroTipoUsuarioPrivilegio } from '../interfaces/registro_tipo_usuario_privilegio_request';
import { TipoUsuario } from '../Models/modeloTipoUsuario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoUsuarioPrivilegioService {
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
  getTiposUsuariosPrivilegios(): Observable<any> {
    return this.http.get<TipoUsuarioPrivilegio[]>(
      `${this.ruta}TipoUsuarioPrivilegio`,
      {
        headers: this.header,
      }
    );
  }

  getTipoUsuarioPrivilegioById(id: number): Observable<any> {
    return this.http.get(`${this.ruta}TipoUsuarioPrivilegio/${id}`, {
      headers: this.header,
    });
  }

  deleteTipoUsuarioPrivilegio(id: number): any {
    return this.http.delete(`${this.ruta}TipoUsuarioPrivilegio/${id}`, {
      headers: this.header,
    });
  }
  getTiposUsuarios(): Observable<any> {
    return this.http.get<TipoUsuario[]>(`${this.ruta}TipoUsuario`, {
      headers: this.header,
    });
  }
  registrarTipoUsuarioPrivilegio(
    modelo: RegistroTipoUsuarioPrivilegio
  ): Observable<any> {
    return this.http.post(`${this.ruta}TipoUsuarioPrivilegio/`, modelo, {
      headers: this.header,
    });
  }
}
