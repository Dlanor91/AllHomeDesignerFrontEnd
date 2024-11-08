import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Categoria } from '../Models/modeloCategoria';
import { RegistroCategoriaRequest } from '../interfaces/registro_categoria_request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
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
  getCategorias(): Observable<any> {
    return this.http.get<Categoria[]>(`${this.ruta}Categoria`, {
      headers: this.header,
    });
  }

  getCategoriaById(id: number): Observable<any> {
    return this.http.get(`${this.ruta}Categoria/${id}`, {
      headers: this.header,
    });
  }

  registrarCategoria(modelo: RegistroCategoriaRequest): Observable<any> {
    return this.http.post(`${this.ruta}Categoria/`, modelo, {
      headers: this.header,
    });
  }

  updateCategoria(categoriaModificada: Categoria, id: number): any {
    return this.http.put(`${this.ruta}Categoria/${id}`, categoriaModificada, {
      headers: this.header,
    });
  }

  deleteCategoria(id: number): any {
    return this.http.delete(`${this.ruta}Categoria/${id}`, {
      headers: this.header,
    });
  }
}
