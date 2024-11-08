import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonaDetalle } from 'src/app/Models/modeloPersonaDetalle';
import { Trabajador } from 'src/app/Models/modeloTrabajador';
import { TrabajadorUpdate } from 'src/app/Models/modeloTrabajadorUpdate';
import { PersonaService } from 'src/app/services/persona.service';
import {
  validarEmail,
  validarNombresDescripciones,
  validarPassword,
} from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-usuarios',
  templateUrl: './edit-usuarios.component.html',
  styleUrls: ['./edit-usuarios.component.css'],
})
export class EditUsuariosComponent implements OnInit {
  id: string = '';
  persona: PersonaDetalle;
  personaUpdate: TrabajadorUpdate;
  editarPersona: boolean;

  constructor(
    private route: ActivatedRoute,
    private _personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
        this.getByCodigoPersona(this.id);
      }
    });
  }

  //#region Acciones de API
  getByCodigoPersona(codigo: string) {
    this._personaService.getPersonaByDocumento(codigo).subscribe(
      (data: PersonaDetalle) => {
        this.persona = data;
        this.persona.password = '';
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
    this.editarPersona = false;
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
        this.personaUpdate = trabajadorDetalle;
        this.editarPersona = true;
      });
  }

  modificarTrabajador(trabajadorMod: PersonaDetalle): void {
    if (
      trabajadorMod.nombreUsuario.trim() == '' ||
      trabajadorMod.password.trim() == ''
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Campos en blanco',
        text: 'No puede dejar campos en blanco.',
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
              title: 'Datos actualizados correctamente',
              text:
                'Los datos de: ' +
                trabajadorMod.nombre +
                ', han sido actualizados satisfactoriamente.',
              color: '#85586F',
              iconColor: '#333',
            });
            this.editarPersona = false;
            this.getByCodigoPersona(this.id);
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops..',
              text:
                'Los datos de: ' +
                trabajadorMod.nombre +
                ', no pudieron ser modificados.',
            });
          }
        );
    }
  }

  cancelar() {
    this.editarPersona = false;
  }

  //#endregion
}
