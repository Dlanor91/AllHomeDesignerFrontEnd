import { Injectable } from '@angular/core';
import { PrecioRequest } from '../interfaces/precio-request';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrecioService {
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

  registroPrecio(modelo: PrecioRequest): Observable<any> {
    return this.http.post(`${this.ruta}Precio/`, modelo, {
      headers: this.header,
    });
  }
}
