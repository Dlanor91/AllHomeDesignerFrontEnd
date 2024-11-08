import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  DepartamentosRequest,
  LocalidadesRequest,
} from 'src/app/interfaces/departamentos_localidades_request';
import { DireccionRequest } from 'src/app/interfaces/direccion_request';
import { RegistroClienteRequest } from 'src/app/interfaces/registro_cliente_request';
import { RegistroTelefonoRequest } from 'src/app/interfaces/registro_telefono';
import { AuthService } from 'src/app/services/auth.service';
import { validateCI } from 'src/helpers/validarCedula';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acceso-registro-cliente',
  templateUrl: './acceso-registro-cliente.component.html',
  styleUrls: ['./acceso-registro-cliente.component.css'],
})
export class AccesoRegistroClienteComponent implements OnInit {
  rucFilial: string;
  docProfesional: string;

  formulario!: FormGroup;
  formularioTelefono!: FormGroup;
  seleccionDepartamento: DepartamentosRequest = {
    id: 0,
    nombre: '',
    localidades: [],
  };
  seleccionLocalidad: LocalidadesRequest = { id: 0, nombre: '' };
  departamentos: DepartamentosRequest[];
  localidades: LocalidadesRequest[];

  form = {
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
  };

  telefono = {
    numero: '',
    documentoPersona: '',
  };
  telefono2 = {
    numero: '',
    documentoPersona: '',
  };

  direccion = {
    calle: '',
    nroPuerta: 0,
    datos: '',
    complemento: '',
    documentoPersona: '',
    idLocalidad: 0,
  };

  constructor(
    private service: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      documento: new FormControl(this.form.documento, [Validators.required]),
      nombre: new FormControl(this.form.nombre, [Validators.required]),
      apellido: new FormControl(this.form.apellido, [Validators.required]),

      email: new FormControl(this.form.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),

      numero: new FormControl(this.telefono.numero),
      numero2: new FormControl(this.telefono2.numero),
      calle: new FormControl(this.direccion.calle),
      nroPuerta: new FormControl(this.direccion.nroPuerta),
      datos: new FormControl(this.direccion.datos),
      complemento: new FormControl(this.direccion.complemento),
      idLocalidad: new FormControl(this.direccion.idLocalidad),
    });
    this.retornarDepartamentos();
  }

  onSelectDepto(event: any): void {
    this.service.getLocalidades(event.id).subscribe({
      next: (data) => {
        this.localidades = data.localidades;
      },
    });
  }

  retornarDepartamentos() {
    this.service.getDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
    });
  }

  get documento() {
    return this.formulario.get('documento')!;
  }
  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get apellido() {
    return this.formulario.get('apellido')!;
  }
  get email() {
    return this.formulario.get('email')!;
  }
  get numero() {
    return this.formularioTelefono.get('numero')!;
  }
  get numero2() {
    return this.formularioTelefono.get('numero2')!;
  }

  enviar() {
    if (!validateCI(this.formulario.value.documento)) {
      Swal.fire({
        icon: 'error',
        title: 'Cédula con formato Inválido',
        text: 'La cédula ingresada no es válida.',
      });
    } else {
      let modelo: RegistroClienteRequest = {
        documento: this.formulario.value.documento,
        nombre: this.formulario.value.nombre,
        apellido: this.formulario.value.apellido,
        email: this.formulario.value.email,
      };

      let modeloTelefono: RegistroTelefonoRequest = {
        numero: this.formulario.value.numero,
        documentoPersona: this.formulario.value.documento,
        codigoSucursal: '',
        rucEmpresa: '',
      };

      let modeloDireccion: DireccionRequest = {
        calle: this.formulario.value.calle,
        nroPuerta: this.formulario.value.nroPuerta,
        datos: this.formulario.value.datos,
        complemento: this.formulario.value.complemento,
        documentoPersona: this.formulario.value.documento,
        idLocalidad: this.formulario.value.idLocalidad.id,
      };

      this.rucFilial = this.cookieService.get('rucFilial');
      this.docProfesional = this.cookieService.get('documentoProfesional');

      this.service
        .registroCliente(modelo, this.rucFilial, this.docProfesional)
        .subscribe({
          next: (data) => {
            if (data.mensaje != '') {
              if (modeloTelefono.numero != '') {
                this.service.registroTelefono(modeloTelefono).subscribe({});
              }
              if (modeloDireccion.calle != '') {
                this.service.registroCalle(modeloDireccion).subscribe({});
              }
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: data.mensaje,
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
