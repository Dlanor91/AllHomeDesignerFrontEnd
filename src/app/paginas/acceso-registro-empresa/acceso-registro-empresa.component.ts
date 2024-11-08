import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RegistroEmpresaRequest } from 'src/app/interfaces/registro_empresa_request';
import { AuthService } from 'src/app/services/auth.service';
import { validarRuc } from 'src/helpers/validarRuc';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acceso-registro-empresa',
  templateUrl: './acceso-registro-empresa.component.html',
  styleUrls: ['./acceso-registro-empresa.component.css'],
})
export class AccesoRegistroEmpresaComponent implements OnInit {
  rucFilial: string;
  docProfesional: string;
  formulario!: FormGroup;
  form = {
    nombre: '',
    ruc: '',
    razonSocial: '',
    email: '',
    comentarios: '',
  };
  constructor(
    private _service: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl(this.form.nombre, [Validators.required]),
      ruc: new FormControl(this.form.ruc, [Validators.required]),
      razonSocial: new FormControl(this.form.razonSocial, [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl(this.form.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      comentarios: new FormControl(this.form.comentarios),
    });
  }
  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get ruc() {
    return this.formulario.get('ruc')!;
  }
  get razonSocial() {
    return this.formulario.get('razonSocial')!;
  }
  get email() {
    return this.formulario.get('email')!;
  }
  get comentarios() {
    return this.formulario.get('comentarios')!;
  }
  get idTipoPersona() {
    return 1;
  }

  enviar() {
    if (!validarRuc(this.formulario.value.ruc)) {
      Swal.fire({
        icon: 'error',
        title: 'RUC/RUT inválido',
        text: 'Ingrese un RUC/RUT válido.',
      });
    } else {
      let modelo: RegistroEmpresaRequest = {
        nombre: this.formulario.value.nombre,
        ruc: this.formulario.value.ruc,
        razonSocial: this.formulario.value.razonSocial,
        email: this.formulario.value.email,
        comentarios: this.formulario.value.comentarios,
      };

      this.rucFilial = this.cookieService.get('rucFilial');
      this.docProfesional = this.cookieService.get('documentoProfesional');

      this._service
        .registroEmpresa(modelo, this.rucFilial, this.docProfesional)
        .subscribe({
          next: (data) => {
            if (data.mensaje != '') {
              Swal.fire({
                icon: 'success',
                title: data.mensaje,
                iconColor: '#333',
              });
              this.router.navigate(['/clientes']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ups! ',
                text: data.error,
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Ups! ',
              text: 'Se produjo un error',
            });
          },
        });
    }
  }
}
