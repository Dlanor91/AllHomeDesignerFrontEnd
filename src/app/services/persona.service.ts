import { Injectable } from '@angular/core';
import { Persona } from '../Models/modeloCliente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Trabajador } from '../Models/modeloTrabajador';
import { TrabajadorUpdate } from '../Models/modeloTrabajadorUpdate';
import { environment } from 'src/environments/environment';
import { PersonaDetalle } from '../Models/modeloPersonaDetalle';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private ruta: string;
  public cliente: Persona;

  constructor(private http: HttpClient, private cookieServices: CookieService) {
    environment.api;
    this.ruta = environment.api;
  }

  bearer: string = 'Bearer ' + this.cookieServices.get('token');

  header = {
    'content-type': 'application/json',
    Authorization: this.bearer,
  };

  //Obtengo todas las personas

  getAllPersona(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.ruta}Persona/`, {
      headers: this.header,
    });
  }

  getAllUsuarios(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${this.ruta}Persona/usuarios/`, {
      headers: this.header,
    });
  }

  getPersonaByDocumento(doc: string): Observable<any> {
    return this.http.get(`${this.ruta}Persona/${doc}`, {
      headers: this.header,
    });
  }

  getPersonaByUserName(nombreUsuario: string): Observable<any> {
    return this.http.get(
      `${this.ruta}Persona/busquedaNombreUsuario/${nombreUsuario}`,
      {
        headers: this.header,
      }
    );
  }

  getTrabajadorByDocumento(doc: string): Observable<any> {
    return this.http.get(`${this.ruta}Persona/${doc}`, {
      headers: this.header,
    });
  }

  getAllTrabajadoresSucursal(codigoSucursal: string): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(
      `${this.ruta}Persona/trabajadoresSucursal/${codigoSucursal}`,
      {
        headers: this.header,
      }
    );
  }

  getAllTrabajadoresFilial(rucFilial: string): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(
      `${this.ruta}Persona/trabajadoresFilial/${rucFilial}`,
      {
        headers: this.header,
      }
    );
  }

  updatePersonaTrabajador(
    personaModificada: TrabajadorUpdate,
    doc: string
  ): any {
    return this.http.put(
      `${this.ruta}Persona/updatePersona/${doc}`,
      personaModificada,
      {
        headers: this.header,
      }
    );
  }

  deletePersonaByDoc(docCliente: string): any {
    return this.http.delete(`${this.ruta}Persona/${docCliente}`, {
      headers: this.header,
    });
  }

  deleteAllTrabajadoresSucursal(codigoSucursal: string): any {
    return this.http.delete(
      `${this.ruta}Persona/borrarTodosTrabajadoresSucursal/${codigoSucursal}`,
      { headers: this.header }
    );
  }
}
