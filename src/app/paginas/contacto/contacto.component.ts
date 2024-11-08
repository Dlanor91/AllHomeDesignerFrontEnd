import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MensajeRequest } from 'src/app/interfaces/mensaje-request';
import { ContactoService } from 'src/app/services/contacto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent implements OnInit {
  formulario!: FormGroup;
  form = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  };

  constructor(private service: ContactoService, private router: Router) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl(this.form.nombre, [Validators.required]),

      email: new FormControl(this.form.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),

      telefono: new FormControl(this.form.telefono, [
        Validators.required,
        Validators.pattern('^[0-9 +]*$'),
      ]),

      mensaje: new FormControl(this.form.mensaje, [Validators.required]),
    });
    7;
  }

  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get email() {
    return this.formulario.get('email')!;
  }
  get telefono() {
    return this.formulario.get('telefono')!;
  }
  get mensaje() {
    return this.formulario.get('mensaje')!;
  }

  enviar() {
    let modelo: MensajeRequest = {
      nombre: this.formulario.value.nombre,
      email: this.formulario.value.email,
      telefono: this.formulario.value.telefono,
      mensaje: this.formulario.value.mensaje,
    };

    this.service.registrarMensaje(modelo).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje enviado',
            text:
              'Gracias por su mensaje ' +
              data.nombre +
              ', será contactado a la brevedad.',
            iconColor: '#333',
          });
          this.router.navigate(['/']);
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
