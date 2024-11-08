import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login_request';
import { RegistroUsuarioRequest } from '../interfaces/registro_usuario_request';
import { RegistroClienteRequest } from '../interfaces/registro_cliente_request';
import { RegistroTelefonoRequest } from '../interfaces/registro_telefono';
import { DireccionRequest } from '../interfaces/direccion_request';
import { RegistroEmpresaRequest } from '../interfaces/registro_empresa_request';
import { CookieService } from 'ngx-cookie-service';
import { RegistroSucursalTelefonoRequest } from '../interfaces/registro_sucursal_telefono';
import { DireccionSucursalRequest } from '../interfaces/direccion_sucursal_request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ruta: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    environment.api;
    this.ruta = environment.api;
  }

  bearer: string = 'Bearer ' + this.cookieService.get('token');

  header = {
    'content-type': 'application/json',
    Authorization: this.bearer,
  };

  login(modelo: LoginRequest): Observable<any> {
    return this.http.post(`${this.ruta}Persona/login`, modelo);
  }

  registrarUsuario(
    modelo: RegistroUsuarioRequest,
    codigoSucursal: string
  ): Observable<any> {
    return this.http.post(
      `${this.ruta}Persona/registrarUsuarios/${codigoSucursal}/`,
      modelo,
      {
        headers: this.header,
      }
    );
  }

  registrarTrabajador(
    modelo: RegistroUsuarioRequest,
    codigoSucursal: string
  ): Observable<any> {
    return this.http.post(
      `${this.ruta}Persona/registro/trabajadores/${codigoSucursal}/`,
      modelo,
      { headers: this.header }
    );
  }

  registroCliente(
    modelo: RegistroClienteRequest,
    rucFilial: string,
    docProfesional: string
  ): Observable<any> {
    return this.http.post(
      `${this.ruta}Persona/registroCliente/${rucFilial}/${docProfesional}`,
      modelo,
      { headers: this.header, responseType: 'json' }
    );
  }

  registroEmpresa(
    modelo: RegistroEmpresaRequest,
    rucFilial: string,
    docProfesional: string
  ): Observable<any> {
    return this.http.post(
      `${this.ruta}Empresa/${rucFilial}/${docProfesional}`,
      modelo,
      { headers: this.header, responseType: 'json' }
    );
  }

  registroTelefono(modelo: RegistroTelefonoRequest): Observable<any> {
    return this.http.post(`${this.ruta}Telefono`, modelo, {
      headers: this.header,
    });
  }

  registroTelefonoPorRuc(
    modelo: RegistroSucursalTelefonoRequest
  ): Observable<any> {
    return this.http.post(`${this.ruta}Telefono`, modelo, {
      headers: this.header,
    });
  }
  registroCallePorRuc(modelo: DireccionSucursalRequest): Observable<any> {
    return this.http.post(`${this.ruta}Direccion`, modelo, {
      headers: this.header,
      responseType: 'text',
    });
  }

  getDepartamentos(): Observable<any> {
    return this.http.get(`${this.ruta}Departamento`, { headers: this.header });
  }

  getLocalidades(id: number): Observable<any> {
    return this.http.get(`${this.ruta}Departamento/${id}`, {
      headers: this.header,
    });
  }

  registroCalle(modelo: DireccionRequest): Observable<any> {
    return this.http.post(`${this.ruta}Direccion`, modelo, {
      headers: this.header,
      responseType: 'text',
    });
  }
}
