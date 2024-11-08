import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Privilegio } from 'src/app/Models/modeloPrivilegios';
import { TipoUsuario } from 'src/app/Models/modeloTipoUsuario';
import { RegistroTipoUsuarioPrivilegio } from 'src/app/interfaces/registro_tipo_usuario_privilegio_request';
import { PrivilegioService } from 'src/app/services/privilegios.service';
import { TipoUsuarioPrivilegioService } from 'src/app/services/tipo-usuario-privilegio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-tipo-usuario-privilegio',
  templateUrl: './registrar-tipo-usuario-privilegio.component.html',
  styleUrls: ['./registrar-tipo-usuario-privilegio.component.css'],
})
export class RegistrarTipoUsuarioPrivilegioComponent implements AfterViewInit {
  tiposDeUsuarios: TipoUsuario[];
  tiposDePrivilegio: Privilegio[];

  formulario!: FormGroup;

  form = {
    idTipoUsuario: 0,
    idPrivilegio: 0,
  };

  seleccionTipoUsuario: TipoUsuario = {
    id: 0,
    rol: '',
    descripcionRol: '',
  };

  seleccionPrivilegio: Privilegio = {
    id: 0,
    tipo: '',
    descripcion: '',
  };

  constructor(
    private _tipoUsuarioPrivilegioService: TipoUsuarioPrivilegioService,
    private tipoPrivilegio: PrivilegioService,
    private service: TipoUsuarioPrivilegioService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.retornarTipoUsuarios();
    this.retornarPrivilegios();
  }
  ngOnInit(): void {
    this.formulario = new FormGroup({
      idTipoUsuario: new FormControl(this.seleccionTipoUsuario.id),
      idPrivilegio: new FormControl(this.seleccionPrivilegio.id),
    });
  }

  retornarTipoUsuarios() {
    this._tipoUsuarioPrivilegioService.getTiposUsuarios().subscribe({
      next: (data) => {
        this.tiposDeUsuarios = data;
      },
    });
  }

  retornarPrivilegios() {
    this.tipoPrivilegio.getPrivilegios().subscribe({
      next: (data) => {
        this.tiposDePrivilegio = data;
      },
    });
  }

  get idTipo() {
    return this.formulario.get('idTipoUsuario')!;
  }
  get idPrivilegio() {
    return this.formulario.get('idPrivilegio')!;
  }

  enviar() {
    let modelo: RegistroTipoUsuarioPrivilegio = {
      idTipoUsuario: this.seleccionTipoUsuario.id,
      idPrivilegio: this.seleccionPrivilegio.id,
    };

    this.service.registrarTipoUsuarioPrivilegio(modelo).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: data.mensaje,
            iconColor: '#333',
          });
          this.router.navigate(['/asignarPrivilegios']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups! ',
            text: data.error,
          });
        }
      },
      error: (error) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'El tipo de usuario seleccionado ya tiene un privilegio asignado.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'Error',
          });
        }
      },
    });
  }
}
