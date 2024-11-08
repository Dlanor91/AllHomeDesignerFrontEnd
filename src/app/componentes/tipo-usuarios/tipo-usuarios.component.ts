import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TipoUsuario } from 'src/app/Models/modeloTipoUsuario';
import { TipoUsuarioService } from 'src/app/services/tipoUsuario.service';
import { paginacion } from 'src/helpers/paginacion';
import { validarNombresDescripciones } from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-usuarios',
  templateUrl: './tipo-usuarios.component.html',
  styleUrls: ['./tipo-usuarios.component.css'],
})
export class TipoUsuariosComponent implements AfterViewInit {
  tiposUsuarios: TipoUsuario[];
  tipoUsuario: TipoUsuario;
  detallesTipoUsuario: boolean;

  displayedColumns: string[] = ['rol', 'descripcion', 'utiles'];
  dataSource: MatTableDataSource<TipoUsuario>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _tipoUsuarioService: TipoUsuarioService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.getTiposUsuarios();
  }

  //#region Datos de API

  getTiposUsuarios() {
    this._tipoUsuarioService.getTiposUsuarios().subscribe(
      (data: TipoUsuario[]) => {
        this.tiposUsuarios = data;
        this.dataSource = new MatTableDataSource(this.tiposUsuarios);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl = new paginacion();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Acciones con las categorias

  consultaEliminar(id: number) {
    this.detallesTipoUsuario = false;
    this._tipoUsuarioService.getTipoUsuarioById(id).subscribe(
      (data: TipoUsuario) => {
        this.tipoUsuario = data;
        Swal.fire({
          title:
            'Desea eliminar el tipo de usuario: ' + this.tipoUsuario.rol + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(id, this.tipoUsuario.rol);
          } else if (result.isDenied) {
            Swal.fire(
              'Tipo usuario: ' + this.tipoUsuario.rol + ', no eliminado.',
              '',
              'info'
            );
          }
        });
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos ' + error,
        });
      }
    );
  }

  eliminar(id: number, nombre: string) {
    this._tipoUsuarioService.deleteTipoUsuario(id).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Tipo usuario: ' + nombre + ', eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getTiposUsuarios();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'El rol: ' +
              nombre +
              ', tiene tiene usuarios asociados no se puede eliminar.',
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

  detalle(id: number) {
    this.detallesTipoUsuario = false;
    this._tipoUsuarioService.getTipoUsuarioById(id).subscribe((data: any) => {
      let tipoUsuarioDetalle: TipoUsuario = {
        id: data.id,
        rol: data.rol,
        descripcionRol: data.descripcionRol,
      };
      this.tipoUsuario = tipoUsuarioDetalle;
      this.detallesTipoUsuario = true;
    });
  }

  modificarCategoria(tipoUsuarioMod: TipoUsuario): void {
    if (!validarNombresDescripciones(tipoUsuarioMod.rol)) {
      Swal.fire({
        icon: 'error',
        title: 'Rol con formato Inválido',
        text: 'El rol no puede tener números, ni menos de 3 caracteres.',
      });
    } else if (!validarNombresDescripciones(tipoUsuarioMod.descripcionRol)) {
      Swal.fire({
        icon: 'error',
        title: 'Descripción con formato Inválido',
        text: 'La descripción no puede tener números, ni menos de 3 caracteres.',
      });
    } else {
      const tipoUsuarioUpdate: TipoUsuario = {
        id: tipoUsuarioMod.id,
        rol: tipoUsuarioMod.rol,
        descripcionRol: tipoUsuarioMod.descripcionRol,
      };

      this._tipoUsuarioService
        .updateTipoUsuario(tipoUsuarioUpdate, tipoUsuarioMod.id)
        .subscribe(
          (data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Tipo usuario actualizado correctamente.',
              text:
                'Los datos del tipo de usuario: ' +
                tipoUsuarioMod.rol +
                ', han sido actualizados satisfactoriamente.',
              color: '#85586F',
              iconColor: '#333',
            });
            this.detallesTipoUsuario = false;
            this.getTiposUsuarios();
          },
          (error: any) => {
            if (error.status === 409) {
              Swal.fire({
                icon: 'error',
                title: 'Oops..',
                text:
                  'El tipo de usuario: ' +
                  tipoUsuarioMod.rol +
                  ', ya existe en nuestra base de datos.',
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
    this.detallesTipoUsuario = false;
  }

  agregarTipo() {
    this.router.navigate(['/registrarTipousuario']);
  }
  //#endregion
}
