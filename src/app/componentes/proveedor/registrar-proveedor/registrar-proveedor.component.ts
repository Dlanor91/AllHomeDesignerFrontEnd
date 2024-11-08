import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroProveedor } from 'src/app/interfaces/registro_proveedor_request';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { validarRuc } from 'src/helpers/validarRuc';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-proveedor',
  templateUrl: './registrar-proveedor.component.html',
  styleUrls: ['./registrar-proveedor.component.css'],
})
export class RegistrarProveedorComponent implements OnInit {
  formulario!: FormGroup;

  form = {
    nombre: '',
    ruc: '',
  };

  constructor(private router: Router, private _proveedor: ProveedorService) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl(this.form.nombre, [Validators.required]),
      ruc: new FormControl(this.form.ruc, [Validators.required]),
    });
  }
  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get ruc() {
    return this.formulario.get('ruc')!;
  }

  enviar() {
    if(!validarRuc(this.formulario.value.ruc)){
      Swal.fire({
        icon: 'error',
        title: 'RUC/RUT inválido',
        text: "Ingrese un RUC/RUT válido.",
      });
    }else{
      let modelo: RegistroProveedor = {
        nombre: this.formulario.value.nombre,
        ruc: this.formulario.value.ruc,
      };

      this._proveedor.registrarProveedor(modelo).subscribe({
        next: (data) => {
          if (data != null) {
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Registro realizado con éxito.',
            });
            this.router.navigate(['/proveedores']);
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
            text: 'RUC/RUT ya ingresado en nuestra base de datos, ingrese otro.',
          });
        },
      });
    }
    }
}
