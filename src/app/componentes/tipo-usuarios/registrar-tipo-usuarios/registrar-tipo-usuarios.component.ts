import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroTipoUsuarioRequest } from 'src/app/interfaces/registro_tipo_usuario_request';
import { TipoUsuarioService } from 'src/app/services/tipoUsuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-tipo-usuarios',
  templateUrl: './registrar-tipo-usuarios.component.html',
  styleUrls: ['./registrar-tipo-usuarios.component.css']
})
export class RegistrarTipoUsuariosComponent implements OnInit {
  formulario!: FormGroup;

  form = {
    rol: '',
    descripcionRol: '',
  };
  constructor(private tipoUsuarioService: TipoUsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      rol: new FormControl(this.form.rol, [Validators.required]),
      descripcionRol: new FormControl(this.form.descripcionRol, [Validators.required]),
    });
  }

  get rol() {
    return this.formulario.get('rol')!;
  }
  get descripcionRol() {
    return this.formulario.get('descripcionRol')!;
  }
  enviar() {
    let modelo: RegistroTipoUsuarioRequest = {
      id:0,
      rol: this.formulario.value.rol,
      descripcionRol: this.formulario.value.descripcionRol,
    };

    this.tipoUsuarioService.registrarTipoUsuario(modelo).subscribe({
      next: (data) => {
        if (data.id != null) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Registro con exito',
          });
          this.router.navigate(['/tiposUsuarios']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups! ',
            text: data,
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
