import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroPrivilegiosRequest } from 'src/app/interfaces/registro_privilegios_request';
import { PrivilegioService } from 'src/app/services/privilegios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-privilegios',
  templateUrl: './registrar-privilegios.component.html',
  styleUrls: ['./registrar-privilegios.component.css']
})
export class RegistrarPrivilegiosComponent implements OnInit {
  formulario!: FormGroup;

  form = {
    tipo: '',
    descripcion: '',
  };
  constructor(private privilegioService: PrivilegioService, private router: Router) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      tipo: new FormControl(this.form.tipo, [Validators.required]),
      descripcion: new FormControl(this.form.descripcion, [Validators.required]),
    });
  }

  get tipo() {
    return this.formulario.get('tipo')!;
  }
  get descripcion() {
    return this.formulario.get('descripcion')!;
  }
  enviar() {
    let modelo: RegistroPrivilegiosRequest = {
      tipo: this.formulario.value.tipo,
      descripcion: this.formulario.value.descripcion,
    };

    this.privilegioService.registroPrivilegio(modelo).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Registro con exito',
          });
          this.router.navigate(['/privilegio']);
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
