import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Proveedor } from '../Models/modeloProveedor';
import { RegistroPrivilegiosRequest } from '../interfaces/registro_privilegios_request';
import { PrivilegioUpdate } from '../Models/modeloPrivilegioUpdate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrivilegioService {
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

  getPrivilegios(): Observable<any> {
    return this.http.get<Proveedor[]>(`${this.ruta}Privilegio`, {
      headers: this.header,
    });
  }

  getPrivilegioById(id: number): Observable<any> {
    return this.http.get(`${this.ruta}Privilegio/${id}`, {
      headers: this.header,
    });
  }

  registroPrivilegio(modelo: RegistroPrivilegiosRequest): Observable<any> {
    return this.http.post(`${this.ruta}Privilegio/`, modelo, {
      headers: this.header,
    });
  }

  updatePrivilegio(privilegioModificado: PrivilegioUpdate, id: number): any {
    return this.http.put(`${this.ruta}Privilegio/${id}`, privilegioModificado, {
      headers: this.header,
    });
  }

  deletePrivilegio(id: number): any {
    return this.http.delete(`${this.ruta}Privilegio/${id}`, {
      headers: this.header,
    });
  }
}
