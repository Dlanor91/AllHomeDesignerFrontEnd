import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filial } from 'src/app/Models/modeloFilial';
import { FilialUpdate } from 'src/app/Models/modeloFilialUpdate';
import { FilialService } from 'src/app/services/filial.service';
import { validarEmail, validarNombresDescripciones } from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-update-filial',
  templateUrl: './edit-update-filial.component.html',
  styleUrls: ['./edit-update-filial.component.css'],
})
export class EditUpdateFilialComponent implements OnInit {
  id: string = '';
  filial: Filial;
  filialUpdate: FilialUpdate;
  emailValido: boolean;
  nombreValido: boolean;

  editarFilial: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _filialService: FilialService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });
    this.getByRucFilial(this.id);
  }

  //#region Acciones de API

  getByRucFilial(ruc: string) {
    this._filialService.getFilialByRuc(ruc).subscribe(
      (data: Filial) => {
        this.filial = data;
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

  editar(ruc: string) {
    this.editarFilial = false;
    this._filialService.getFilialByRuc(ruc).subscribe((data: any) => {
      let filialDetalle: FilialUpdate = {
        nombre: data.nombre,
        estado: data.estado,
        email: data.email,
      };
      this.filialUpdate = filialDetalle;
      this.editarFilial = true;
    });
  }

  modificarFilial(filialMod: Filial): void {
    this.emailValido = validarEmail(filialMod.email);
    this.nombreValido = validarNombresDescripciones(filialMod.nombre);

    if (!this.nombreValido) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre con formato Inválido',
        text: 'El nombre no puede tener números, ni menos de 3 caracteres.',
      });
    } else {
      if (!this.emailValido) {
        Swal.fire({
          icon: 'error',
          title: 'E-mail con formato Inválido',
          text: 'El e-mail ingresado no tiene un formato válido.',
        });
      } else {
        const filialGenerada: FilialUpdate = {
          nombre: filialMod.nombre,
          email: filialMod.email,
          estado: filialMod.estado,
        };

        this._filialService
          .updateFilial(filialGenerada, this.filial.ruc)
          .subscribe(
            (data: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Filial actualizada correctamente',
                text:
                  'Los datos de la filial: ' +
                  filialGenerada.nombre +
                  ', han sido actualizados satisfactoriamente.',
                color: '#85586F',
                iconColor: '#333',
              });
              this.editarFilial = false;
              this.getByRucFilial(this.filial.ruc);
            },
            (error: any) => {
              if (error.status === 409) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops..',
                  text:
                    'El e-mail ingresado: ' +
                    filialGenerada.email +
                    ', ya está asociado a otra filial.',
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops..',
                  text: 'Error',
                });
              }
            }
          );
      }
    }
  }

  cancelar() {
    this.editarFilial = false;
  }

  registrarSucursal(rucFilial:string) {
    this.router.navigate(['/registrarSucursal',rucFilial]);
  }

  //#endregion
}
