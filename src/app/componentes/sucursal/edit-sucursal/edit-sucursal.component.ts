import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion } from 'src/app/Models/modeloDireccion';
import { Sucursal } from 'src/app/Models/modeloSucursal';
import { SucursalUpdate } from 'src/app/Models/modeloSucursalUpdate';
import { Telefono } from 'src/app/Models/modeloTelefono';
import { DireccionService } from 'src/app/services/direccion.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TelefonoService } from 'src/app/services/telefono.service';
import { validarEmail, validarNombresDescripciones } from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-sucursal',
  templateUrl: './edit-sucursal.component.html',
  styleUrls: ['./edit-sucursal.component.css'],
})
export class EditSucursalComponent implements OnInit {
  codigo: string = '';
  sucursal: Sucursal;
  telefono: Telefono;
  direccion: Direccion;
  direccionConformada: string;
  telefonoConformado: string;

  sucursalUpdate: SucursalUpdate;
  editarSucursal: boolean;

  constructor(
    private route: ActivatedRoute,
    private _sucursalService: SucursalService,
    private _telefonoService: TelefonoService,
    private _direccionService: DireccionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const codigo = params.get('id');
      if (codigo !== null) {
        this.codigo = codigo;
      }
    });
    this.getSucursalByCodigo(this.codigo);
  }

  //#region Acciones de API

  mostrarTrabajadores(codigo: string) {
    this.router.navigate(['/detallesSucursal/mostrarTrabajadores/', codigo]);
  }

  getSucursalByCodigo(codigo: string) {
    this._sucursalService.getSucursalByCodigo(codigo).subscribe(
      (data: Sucursal) => {
        this.sucursal = data;
        if (this.sucursal.idTelefono != 0 && this.sucursal.idTelefono !== null)
          this.getTelefonoByCodigo(this.sucursal.idTelefono);
        else this.telefonoConformado = '';

        if (
          this.sucursal.idDireccion != 0 &&
          this.sucursal.idDireccion !== null
        )
          this.getDireccionByCodigo(this.sucursal.idDireccion);
        else this.direccionConformada = '';
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

  getTelefonoByCodigo(id: number) {
    this._telefonoService.getTelefonoById(id).subscribe(
      (data: Telefono) => {
        this.telefono = data;
        this.telefonoConformado = this.telefono.numero;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos del telefono.',
        });
      }
    );
  }

  getDireccionByCodigo(id: number) {
    this._direccionService.getDireccionById(id).subscribe(
      (data: Direccion) => {
        this.direccion = data;
        this.direccionConformada =
          this.direccion.calle +
          ' #' +
          this.direccion.nroPuerta +
          ', ' +
          this.direccion.nombreLocalidad +
          ', ' +
          this.direccion.departamento;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos de la direccion.',
        });
      }
    );
  }

  //#endregion

  //#region Acciones

  editar(codigo: string) {
    this.editarSucursal = false;
    this._sucursalService.getSucursalByCodigo(codigo).subscribe((data: any) => {
      console.log(this.sucursal);
      let sucursalDetalle: SucursalUpdate = {
        nombre: data.nombre,
        email: data.email,
        detalles: data.detalles,
        idTelefono: data.idTelefono,
        idDireccion: data.idDireccion,
      };
      this.sucursalUpdate = sucursalDetalle;
      this.editarSucursal = true;
    });
  }

  modificarSucursal(sucursalMod: Sucursal): void {
    if(!validarNombresDescripciones(sucursalMod.nombre)){
      Swal.fire({
        icon: 'error',
        title: 'Nombre con formato Inválido',
        text: 'El nombre no puede tener números, ni menos de 3 caracteres.',
      });
    }else if(!validarNombresDescripciones(sucursalMod.detalles)){
      Swal.fire({
        icon: 'error',
        title: 'Descripción con formato Inválido',
        text: 'La descripción no puede tener números, ni menos de 3 caracteres.',
      });
    }else if(!validarEmail(sucursalMod.email)){
      Swal.fire({
        icon: 'error',
        title: 'E-mail con formato Inválido',
        text: 'E-mail con formato incorrecto',
      });
    }else{
      const sucursalGenerada: SucursalUpdate = {
        nombre: sucursalMod.nombre,
        email: sucursalMod.email,
        detalles: sucursalMod.detalles,
        idTelefono: sucursalMod.idTelefono,
        idDireccion: sucursalMod.idDireccion,
      };

      this._sucursalService
        .updateSucursal(sucursalGenerada, this.sucursal.codigo)
        .subscribe(
          (data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Filial actualizada correctamente',
              text:
                'Los datos de la filial: ' +
                sucursalGenerada.nombre +
                ' han sido actualizados satisfactoriamente.',
              color: '#85586F',
              iconColor: '#333',
            });
            this.editarSucursal = false;
            this.getSucursalByCodigo(this.sucursal.codigo);
          },
          (error: any) => {
            if (error.status === 409) {
              Swal.fire({
                icon: 'error',
                title: 'Oops..',
                text:
                  'El correo ingresado: ' +
                  sucursalGenerada.email +
                  ' ya esta asociado a otra filial.',
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

  cancelar() {
    this.editarSucursal = false;
  }
  //#endregion
}
