import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroCategoriaRequest } from 'src/app/interfaces/registro_categoria_request';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-categoria',
  templateUrl: './registrar-categoria.component.html',
  styleUrls: ['./registrar-categoria.component.css']
})
export class RegistrarCategoriaComponent implements OnInit {
  formulario!: FormGroup;

  form = {
    nombre: '',
    descripcion: '',
  };
  constructor(private categoriaService: CategoriaService, private router: Router) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl(this.form.nombre, [Validators.required]),
      descripcion: new FormControl(this.form.descripcion, [Validators.required]),
    });
  }

  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get descripcion() {
    return this.formulario.get('descripcion')!;
  }
  enviar() {
    let modelo: RegistroCategoriaRequest = {
      nombre: this.formulario.value.nombre,
      descripcion: this.formulario.value.descripcion,
    };

    this.categoriaService.registrarCategoria(modelo).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Registro con éxito',
          });
          this.router.navigate(['/categorias']);
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
