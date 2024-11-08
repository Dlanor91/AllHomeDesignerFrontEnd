import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Persona } from 'src/app/Models/modeloCliente';
import { PersonaDetalle } from 'src/app/Models/modeloPersonaDetalle';
import { TipoUsuario } from 'src/app/Models/modeloTipoUsuario';
import { Trabajador } from 'src/app/Models/modeloTrabajador';
import { TrabajadorUpdate } from 'src/app/Models/modeloTrabajadorUpdate';
import { PersonaService } from 'src/app/services/persona.service';
import {
  validarEmail,
  validarNombresDescripciones,
  validarPassword,
  validarUsuario,
} from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-trabajadores',
  templateUrl: './edit-trabajadores.component.html',
  styleUrls: ['./edit-trabajadores.component.css'],
})
export class EditTrabajadoresComponent implements OnInit {
  id: string = '';
  trabajador: PersonaDetalle;
  trabajadorUpdate: TrabajadorUpdate;

  editarTrabajador: boolean;

  constructor(
    private route: ActivatedRoute,
    private _personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
        this.getByCodigoTrabajador(this.id);
      }
    });
  }

  //#region Acciones de API
  getByCodigoTrabajador(codigo: string) {
    this._personaService.getTrabajadorByDocumento(codigo).subscribe(
      (data: PersonaDetalle) => {
        this.trabajador = data;
        this.trabajador.password = '';
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos.',
        });
      }
    );
  }

  //#endregion

  //#region Acciones
  editar(codigo: string) {
    this.editarTrabajador = false;
    this._personaService
      .getTrabajadorByDocumento(codigo)
      .subscribe((data: any) => {
        let trabajadorDetalle: TrabajadorUpdate = {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          nombreUsuario: data.nombreUsuario,
          password: data.password,
          idTipoUsuario: data.idTipoUsuario,
        };
        this.trabajadorUpdate = trabajadorDetalle;
        this.editarTrabajador = true;
      });
  }

  modificarTrabajador(trabajadorMod: PersonaDetalle): void {
    if (!validarUsuario(trabajadorMod.nombreUsuario)) {
      Swal.fire({
        icon: 'error',
        title: 'Usuario con formato Inválido',
        text: 'El usuario debe tener mínimo 4 caracteres.',
      });
    } else if (!validarPassword(trabajadorMod.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña con formato Inválido',
        text: 'La contraseña debe tener entre 8 y 16 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo especial (!@#$%^&*=+-_)',
      });
    } else if (!validarEmail(trabajadorMod.email)) {
      Swal.fire({
        icon: 'error',
        title: 'E-mail con formato Inválido',
        text: 'El e-mail ingresado no tiene un formato válido.',
      });
    } else {
      const trab: TrabajadorUpdate = {
        nombre: trabajadorMod.nombre,
        apellido: trabajadorMod.apellido,
        nombreUsuario: trabajadorMod.nombreUsuario,
        password: trabajadorMod.password,
        email: trabajadorMod.email,
        idTipoUsuario: trabajadorMod.idTipoUsuario,
      };

      this._personaService
        .updatePersonaTrabajador(trab, trabajadorMod.documento)
        .subscribe(
          (data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Trabajador actualizado correctamente',
              text:
                'Los datos del trabajador: ' +
                trabajadorMod.nombre +
                ', han sido actualizados satisfactoriamente.',
              color: '#85586F',
              iconColor: '#333',
            });
            this.editarTrabajador = false;
            this.getByCodigoTrabajador(this.id);
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops..',
              text:
                'El trabajador: ' +
                trabajadorMod.nombre +
                ', no pudo ser modificado.',
            });
          }
        );
    }
  }

  cancelar() {
    this.editarTrabajador = false;
  }

  //#endregion
}
