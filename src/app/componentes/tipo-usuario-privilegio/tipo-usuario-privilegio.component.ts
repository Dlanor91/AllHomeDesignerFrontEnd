import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TipoUsuarioPrivilegio } from 'src/app/Models/modeloTipoUsuarioPrivilegio';
import { TipoUsuarioPrivilegioService } from 'src/app/services/tipo-usuario-privilegio.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-usuario-privilegio',
  templateUrl: './tipo-usuario-privilegio.component.html',
  styleUrls: ['./tipo-usuario-privilegio.component.css'],
})
export class TipoUsuarioPrivilegioComponent implements AfterViewInit {
  tiposUsuariosPrivilegios: TipoUsuarioPrivilegio[];
  tipoUsuarioPrivilegio: TipoUsuarioPrivilegio;
  detallesTipoUsuarioPrivilegio: boolean;

  datosModificadosCorrectamente: boolean = false;
  noContieneNumeros: boolean = true;
  menosCaracteres: boolean = true;

  displayedColumns: string[] = ['rol', 'tipo', 'utiles'];
  dataSource: MatTableDataSource<TipoUsuarioPrivilegio>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _tipoUsuarioPrivilegioService: TipoUsuarioPrivilegioService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.getTipoUsuarioPrivilegio();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  agregarAsignarPrivilegio() {
    this.router.navigate(['/registrarAsignarPrivilegios']);
  }

  //#region Datos de API

  getTipoUsuarioPrivilegio() {
    this._tipoUsuarioPrivilegioService.getTiposUsuariosPrivilegios().subscribe(
      (data: TipoUsuarioPrivilegio[]) => {
        this.tiposUsuariosPrivilegios = data;
        this.dataSource = new MatTableDataSource(this.tiposUsuariosPrivilegios);
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
  //#endregion

  //#region Acciones con las categorias

  consultaEliminar(id: number) {
    this._tipoUsuarioPrivilegioService
      .getTipoUsuarioPrivilegioById(id)
      .subscribe(
        (data: TipoUsuarioPrivilegio) => {
          this.tipoUsuarioPrivilegio = data;
          Swal.fire({
            title:
              'Desea eliminar el privilegio asignado: ' +
              this.tipoUsuarioPrivilegio.rol +
              ' - ' +
              this.tipoUsuarioPrivilegio.tipo +
              ' ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              this.eliminar(id);
            } else if (result.isDenied) {
              Swal.fire(
                'Privilegio asignado: ' +
                  this.tipoUsuarioPrivilegio.rol +
                  ' - ' +
                  this.tipoUsuarioPrivilegio.tipo +
                  ' no eliminado.',
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

  eliminar(id: number) {
    this._tipoUsuarioPrivilegioService
      .deleteTipoUsuarioPrivilegio(id)
      .subscribe(
        (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Privilegio asignado, eliminado satisfactoriamente.',
            color: '#85586F',
            iconColor: '#333',
          });
          this.getTipoUsuarioPrivilegio();
        },
        (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'Error',
          });
        }
      );
  }

  //#endregion
}
