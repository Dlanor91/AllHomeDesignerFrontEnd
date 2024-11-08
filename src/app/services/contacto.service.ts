import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { MensajeRequest } from '../interfaces/mensaje-request';
import { Mensaje } from '../Models/modeloMensaje';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
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

  getMensajes(): Observable<any> {
    return this.http.get<Mensaje[]>(`${this.ruta}Mensaje`, {
      headers: this.header,
    });
  }

  getMensajesById(id: number): Observable<any> {
    return this.http.get(`${this.ruta}Mensaje/${id}`, { headers: this.header });
  }

  registrarMensaje(modelo: MensajeRequest): Observable<any> {
    return this.http.post(`${this.ruta}Mensaje/`, modelo, {
      headers: this.header,
    });
  }

  deleteMensaje(id: number): any {
    return this.http.delete(`${this.ruta}Mensaje/${id}`, {
      headers: this.header,
    });
  }
}
