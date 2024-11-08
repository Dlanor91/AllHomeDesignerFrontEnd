import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RegistroTelefonoRequest } from 'src/app/interfaces/registro_telefono';
import { RegistroTipoUsuarioRequest } from 'src/app/interfaces/registro_tipo_usuario_request';
import { RegistroUsuarioRequest } from 'src/app/interfaces/registro_usuario_request';
import { AuthService } from 'src/app/services/auth.service';
import { validarNombresDescripciones } from 'src/helpers/validaciones';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-acceso-registro',
  templateUrl: './acceso-registro.component.html',
  styleUrls: ['./acceso-registro.component.css'],
})
export class AccesoRegistroComponent implements OnInit {
  formulario!: FormGroup;
  formularioTelefono!: FormGroup;

  codigoSucursal: string;
  rol: string;
  tiposUsuarios: RegistroTipoUsuarioRequest[];
  codigo: string;

  datos1: RegistroTipoUsuarioRequest = {
    id: 1,
    rol: 'Vendedor',
    descripcionRol: 'Personal de sucursal.',
  };
  datos2: RegistroTipoUsuarioRequest = {
    id: 5,
    rol: 'Supervisor',
    descripcionRol: 'Es el encargado de los vendedores de las sucursales.',
  };
  datos4: RegistroTipoUsuarioRequest = {
    id: 7,
    rol: 'Recursos Humanos',
    descripcionRol:
      'Son los encargados de llevar el control y registro del personal en las diferentes sucursales.',
  };
  datos5: RegistroTipoUsuarioRequest = {
    id: 8,
    rol: 'Comercial',
    descripcionRol:
      'Encargados de la gestión de compras y ventas de las sucursales.',
  };
  datos3: RegistroTipoUsuarioRequest = {
    id: 6,
    rol: 'Gerente',
    descripcionRol:
      'Es el encargado de la gestión de personal en las sucursales.',
  };

  telefono = {
    numero: '',
    documentoPersona: '',
  };

  tiposUsuariosFilial: RegistroTipoUsuarioRequest[] = [
    this.datos1,
    this.datos2,
    this.datos4,
    this.datos5,
    this.datos3,
  ];

  datos6: RegistroTipoUsuarioRequest = {
    id: 4,
    rol: 'Profesional',
    descripcionRol: '',
  };
  datos7: RegistroTipoUsuarioRequest = {
    id: 2,
    rol: 'Administrador',
    descripcionRol: '',
  };

  tiposUsuariosAdmin: RegistroTipoUsuarioRequest[] = [
    this.datos6,
    this.datos7,
    this.datos3,
  ];

  seleccionTipoUsuario: RegistroTipoUsuarioRequest = {
    id: 0,
    rol: '',
    descripcionRol: '',
  };

  form = {
    documento: '',
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    password: '',
    idTipoUsuario: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private _service: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const codigo = params.get('id');
      if (codigo !== null) {
        this.codigo = codigo;
      }
    });
    if (this.codigo != 'user') this.codigoSucursal = this.codigo;
    else this.codigoSucursal = '';

    this.rol = this.cookieService.get('rol');
    this.formulario = new FormGroup({
      documento: new FormControl(this.form.documento, [Validators.required]),
      nombre: new FormControl(this.form.nombre, [
        Validators.required,
        Validators.minLength(3),
      ]),
      apellido: new FormControl(this.form.apellido, [
        Validators.required,
        Validators.minLength(3),
      ]),
      nombreUsuario: new FormControl(this.form.nombreUsuario, [
        Validators.required,
        Validators.minLength(4),
      ]),
      email: new FormControl(this.form.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      numero: new FormControl(this.telefono.numero),
      password: new FormControl(this.form.password, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}'
        ),
      ]),
      idTipoUsuario: new FormControl(this.seleccionTipoUsuario.id, [
        Validators.required,
      ]),
      idTipoUsuarioAdmin: new FormControl(this.seleccionTipoUsuario.id, [
        Validators.required,
      ]),
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
  get nombreUsuario() {
    return this.formulario.get('nombreUsuario')!;
  }
  get email() {
    return this.formulario.get('email')!;
  }
  get numero() {
    return this.formularioTelefono.get('numero')!;
  }
  get password() {
    return this.formulario.get('password')!;
  }

  get idTipoUsuario() {
    return this.formulario.get('idTipoUsuario');
  }

  get idTipoUsuarioAdmin() {
    return this.formulario.get('idTipoUsuarioAdmin');
  }

  enviarTrabajador() {
    if (this.formulario.value.idTipoUsuario.id == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Tipo de Usuario en blanco',
        text: 'Debe seleccionar un tipo de usuario.',
      });
    } else {
      let modelo: RegistroUsuarioRequest = {
        documento: this.formulario.value.documento,
        nombre: this.formulario.value.nombre,
        apellido: this.formulario.value.apellido,
        nombreUsuario: this.formulario.value.nombreUsuario,
        email: this.formulario.value.email,
        password: this.formulario.value.password,
        idTipoUsuario: this.formulario.value.idTipoUsuario.id,
      };

      this._service.registrarTrabajador(modelo, this.codigoSucursal).subscribe({
        next: (data) => {
          if (data.mensaje == '') {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo completar el registro',
              text: data.error,
            });
          } else if (
            data.mensaje != ''
          ) {
            this.registrarTelefono();
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Registro con éxito',
            });
            this.router.navigate(['/listarTrabajadores/']);
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Ups! ',
            text: 'Se produjo un error.',
          });
        },
      });
    }
  }

  enviarPersonal() {
    if (this.formulario.value.idTipoUsuario.id == '') {
      Swal.fire({
        icon: 'error',
        title: 'Tipo de Usuario en blanco',
        text: 'Debe seleccionar un tipo de usuario.',
      });
    } else {
      let modelo: RegistroUsuarioRequest = {
        documento: this.formulario.value.documento,
        nombre: this.formulario.value.nombre,
        apellido: this.formulario.value.apellido,
        nombreUsuario: this.formulario.value.nombreUsuario,
        email: this.formulario.value.email,
        password: this.formulario.value.password,
        idTipoUsuario: this.formulario.value.idTipoUsuarioAdmin.id,
      };

      if (this.codigoSucursal == '' && modelo.idTipoUsuario == 6) {
        Swal.fire({
          icon: 'error',
          title: 'Tipo de Usuario incorrecto',
          text: 'No se puede seleccionar gerente si no esta asociado a una sucursal',
        });
      } else {
        if (this.codigoSucursal == '') this.codigoSucursal = 'persona';
        this._service.registrarUsuario(modelo, this.codigoSucursal).subscribe({
          next: (data) => {
            if (data.mensaje == '') {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo completar el registro',
                text: data.error,
              });
            } else if (
              data.mensaje != ''
            ) {
              this.registrarTelefono();
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Registro con éxito',
              });
              this.router.navigate(['/usuarios']);
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Ups! ',
              text: 'Se produjo un error.',
            });
          },
        });
      }
    }
  }

  registrarTelefono() {
    let modeloTelefono: RegistroTelefonoRequest = {
      numero: this.formulario.value.numero,
      documentoPersona: this.formulario.value.documento,
      codigoSucursal: '',
      rucEmpresa: '',
    };

    if (modeloTelefono.numero != '') {
      this._service.registroTelefono(modeloTelefono).subscribe({});
    }
  }
}
