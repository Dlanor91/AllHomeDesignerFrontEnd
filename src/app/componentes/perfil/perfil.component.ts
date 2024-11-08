import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PersonaDetalle } from 'src/app/Models/modeloPersonaDetalle';
import { Trabajador } from 'src/app/Models/modeloTrabajador';
import { TrabajadorUpdate } from 'src/app/Models/modeloTrabajadorUpdate';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  persona: PersonaDetalle;
  id: string = '';
  cambiarPass: boolean;
  formulario: FormGroup;

  form = {
    password: '',
    confirmPassword: '',
  };

  constructor(
    private route: ActivatedRoute,
    private _personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });
    this.getDatosUsuarioByUserName(this.id);
    this.initForm();
  }
  get password() {
    return this.formulario.get('password')!;
  }
  get confirmPassword() {
    return this.formulario.get('confirmPassword')!;
  }

  //#region Acciones Api

  getDatosUsuarioByUserName(doc: string) {
    this._personaService.getPersonaByDocumento(doc).subscribe(
      (data: PersonaDetalle) => {
        this.persona = data;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al cargar los datos.',
        });
      }
    );
  }

  updateDatosUsuarioByUserName(personaAct: PersonaDetalle) {
    const trab: TrabajadorUpdate = {
      nombre: personaAct.nombre,
      apellido: personaAct.apellido,
      nombreUsuario: personaAct.nombreUsuario,
      password: this.password.value,
      email: personaAct.email,
      idTipoUsuario: personaAct.idTipoUsuario,
    };

    this._personaService
      .updatePersonaTrabajador(trab, personaAct.documento)
      .subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text:
              'La contraseña de: ' +
              personaAct.nombre +
              ' ha sido actualizada satisfactoriamente.',
            color: '#85586F',
            iconColor: '#333',
          });
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'Error al cargar los datos.',
          });
        }
      );
  }

  //#endregion

  //#region Acciones

  editar(documento: string) {
    this.cambiarPass = true;
  }

  modificar(personaUpdate: PersonaDetalle) {
    if (this.password.value === '' || this.confirmPassword.value === '') {
      Swal.fire({
        icon: 'error',
        title: 'Campos en blanco..',
        text: 'No se permiten campos en blanco.',
      });
    } else {
      if (this.password.value != this.confirmPassword.value) {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Las contraseñas no coinciden.',
        });
      } else {
        this.updateDatosUsuarioByUserName(personaUpdate);
        this.cambiarPass = false;
        this.limpiarPassword();
      }
    }
  }

  cancelar() {
    this.limpiarPassword();
    this.cambiarPass = false;
  }

  //#endregion

  //#region Cambiar contraseña
  limpiarPassword() {
    const passwordControl = this.formulario.get('password');
    if (passwordControl) {
      passwordControl.reset();
    }

    const passwordControlConfirm = this.formulario.get('confirmPassword');
    if (passwordControlConfirm) {
      passwordControlConfirm.reset();
    }
  }

  initForm = (): void => {
    this.formulario = new FormGroup({
      password: new FormControl(this.form.password, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}'
        ),
      ]),
      confirmPassword: new FormControl(this.form.confirmPassword, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}'
        ),
      ]),
    });
  };

  //#endregion
}
