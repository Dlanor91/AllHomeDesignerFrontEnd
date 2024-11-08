import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { personaUpdate } from '../Models/modeloPersonaUpdate';
import { empresaUpdate } from '../Models/modeloEmpresaUpdate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteServices {
  ruta: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    environment.api;
    this.ruta = environment.api;
  }

  bearer: string = 'Bearer ' + this.cookieService.get('token');
  docProfesional: string = this.cookieService.get('documentoProfesional');
  rucFilial: string = this.cookieService.get('rucFilial');

  header = {
    'content-type': 'application/json',
    Authorization: this.bearer,
  };

  //#region Extrae información desde la API

  getClientes(): Observable<any> {
    return this.http.get(
      `${this.ruta}ClienteRegistro/clientesListados/${this.docProfesional}/${this.rucFilial}`,
      { headers: this.header }
    );
  }

  getEmpresas(): Observable<any> {
    return this.http.get(
      `${this.ruta}ClienteRegistro/empresasListadas/${this.docProfesional}/${this.rucFilial}`,
      { headers: this.header }
    );
  }

  getClienteByDoc(docCliente: string): any {
    return this.http.get(`${this.ruta}Persona/${docCliente}`, {
      headers: this.header,
    });
  }

  getEmpresaByRuc(docCliente: string): any {
    return this.http.get(`${this.ruta}Empresa/${docCliente}`, {
      headers: this.header,
    });
  }

  //#endregion

  //#region Eliminar datos de la API

  deleteEmpresaByRuc(ruc: string): any {
    return this.http.delete(`${this.ruta}Empresa/${ruc}`, {
      headers: this.header,
    });
  }

  deletePersonaByDoc(docCliente: string): any {
    return this.http.delete(`${this.ruta}Persona/${docCliente}`, {
      headers: this.header,
    });
  }

  //#endregion

  //#region Modificar datos de la API

  modificarPersonaByDoc(pers: personaUpdate, docCliente: string): any {
    return this.http.put(
      `${this.ruta}Persona/updateCliente/${docCliente}`,
      pers,
      { headers: this.header }
    );
  }

  modificarEmpresaByRuc(emp: empresaUpdate, ruc: string): Observable<any> {
    return this.http.put(`${this.ruta}Empresa/${ruc}`, emp, {
      headers: this.header,
    });
  }

  //#endregion
}
