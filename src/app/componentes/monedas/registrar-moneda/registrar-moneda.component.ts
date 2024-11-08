import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroMoneda } from 'src/app/interfaces/registro_moneda_request';
import { MonedaService } from 'src/app/services/moneda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-moneda',
  templateUrl: './registrar-moneda.component.html',
  styleUrls: ['./registrar-moneda.component.css'],
})
export class RegistrarMonedaComponent implements OnInit {
  formulario!: FormGroup;

  form = {
    codigo: '',
    descripcion: '',
    cotizacion: 0,
    simbolo: '',
  };

  constructor(private router: Router, private monedaService: MonedaService) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      codigo: new FormControl(this.form.codigo, [Validators.required]),
      descripcion: new FormControl(this.form.descripcion, [
        Validators.required,
      ]),
      cotizacion: new FormControl(this.form.cotizacion, [Validators.required]),
      simbolo: new FormControl(this.form.descripcion, [Validators.required]),
    });
  }
  get codigo() {
    return this.formulario.get('codigo')!;
  }
  get descripcion() {
    return this.formulario.get('descripcion')!;
  }
  get cotizacion() {
    return this.formulario.get('cotizacion')!;
  }
  get simbolo() {
    return this.formulario.get('simbolo')!;
  }

  enviar() {
    let modelo: RegistroMoneda = {
      codigo: this.formulario.value.codigo,
      descripcion: this.formulario.value.descripcion,
      cotizacion: this.formulario.value.cotizacion,
      simbolo: this.formulario.value.simbolo,
    };

    this.monedaService.registroMoneda(modelo).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Registro con exito',
          });
          this.router.navigate(['/moneda']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups! ',
            text: 'Error:' + data,
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Ups! ',
          text: 'Ha habido un error al ingresar la moneda.',
        });
      },
    });
  }
}
