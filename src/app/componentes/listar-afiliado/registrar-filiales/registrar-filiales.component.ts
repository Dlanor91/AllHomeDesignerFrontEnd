import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroFilialesRequest } from 'src/app/interfaces/registro_filiales';
import { FilialService } from 'src/app/services/filial.service';
import { validarRuc } from 'src/helpers/validarRuc';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-afiliado',
  templateUrl: './registrar-filiales.component.html',
  styleUrls: ['./registrar-filiales.component.css'],
})
export class RegistrarFilialComponent implements OnInit {
  formulario!: FormGroup;
  esValidoRuc: boolean;

  form = {
    nombre: '',
    ruc: '',
    email: '',
    estado: '',
  };
  constructor(private _filialService: FilialService, private router: Router) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl(this.form.nombre, [Validators.required]),
      ruc: new FormControl(this.form.ruc, [Validators.required]),

      email: new FormControl(this.form.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      estado: new FormControl(this.form.estado),
    });
  }

  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get ruc() {
    return this.formulario.get('ruc')!;
  }
  get email() {
    return this.formulario.get('email')!;
  }
  get estado() {
    return this.formulario.get('estado')!;
  }

  enviar() {

    if(!validarRuc(this.formulario.value.ruc)){
      Swal.fire({
        icon: 'error',
        title: 'RUC/RUT inválido',
        text: "Ingrese un RUC/RUT válido.",
      });
    }else{
      let modelo: RegistroFilialesRequest = {
        ruc: this.formulario.value.ruc,
        nombre: this.formulario.value.nombre,
        email: this.formulario.value.email,
        estado: this.formulario.value.estado,
      };

      this._filialService.registroFilial(modelo).subscribe({
        next: (data) => {
          if (data != null) {
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Registro realizado con éxito.',
            });
            this.router.navigate(['/filiales']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ups! ',
              text: data,
            });
          }
        },
        error: (error) => {
          if (error.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Oops..',
              text:
                'Ya existe una filial ingresada con ese RUC/RUT: ' +
                modelo.ruc +
                ' .',
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
}
