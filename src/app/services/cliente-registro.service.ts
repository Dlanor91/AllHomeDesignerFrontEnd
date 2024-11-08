import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RegistroClienteRegistroRequest } from '../interfaces/registro-cliente-registro-request';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteRegistroService {
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

  getVerificarCliente(
    documentoProfesiona: string,
    rucFilial: string,
    documentoCliente: string
  ): Observable<any> {
    return this.http.get(
      `${this.ruta}ClienteRegistro/verificarCliente/${documentoProfesiona}/${rucFilial}/${documentoCliente}`,
      {
        headers: this.header,
      }
    );
  }

  getVerificarEmpresa(
    documentoProfesiona: string,
    rucFilial: string,
    rucEmpresa: string
  ): Observable<any> {
    return this.http.get(
      `${this.ruta}ClienteRegistro/verificarEmpresa/${documentoProfesiona}/${rucFilial}/${rucEmpresa}`,
      {
        headers: this.header,
      }
    );
  }

  /*
    200 --> Ya existe y pertenece a esa empresa y/o profesional
    201 --> Ya existe pero no pertenece a la empresa y/o profesional
    404 --> No existe en base
    */

  registrarCliente(modelo: RegistroClienteRegistroRequest): Observable<any> {
    return this.http.post(`${this.ruta}ClienteRegistro/`, modelo, {
      headers: this.header,
    });
  }
}
