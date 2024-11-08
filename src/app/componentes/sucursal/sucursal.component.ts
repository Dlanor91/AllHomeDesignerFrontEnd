import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Sucursal } from 'src/app/Models/modeloSucursal';
import { PersonaService } from 'src/app/services/persona.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css'],
})
export class SucursalComponent implements AfterViewInit {
  sucursales: Sucursal[];
  sucursal: Sucursal;
  detallesSucursal: boolean;
  rol: string;
  rucFilial: string;

  displayedColumns: string[] = ['codigo', 'nombre', 'detalles', 'utiles'];
  dataSource: MatTableDataSource<Sucursal>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _sucursalService: SucursalService,
    private _personaService: PersonaService,
    private paginatorIntl: MatPaginatorIntl,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.rol = this.cookieService.get('rol');
    this.rucFilial = this.cookieService.get('rucFilial');
    if (this.rol != 'Superadmin') this.getSucursalesByRuc();
    else this.getSucursales();

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API
  getSucursales() {
    this._sucursalService.getSucursales().subscribe(
      (data: Sucursal[]) => {
        this.sucursales = data;
        this.dataSource = new MatTableDataSource(this.sucursales);
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

  getSucursalesByRuc() {
    this._sucursalService.getSucursalesByRuc().subscribe(
      (data: Sucursal[]) => {
        this.sucursales = data;
        this.dataSource = new MatTableDataSource(this.sucursales);
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

  //#region Acciones

  agregarSucursal() {
    this.router.navigate(['/registrarSucursal',this.rucFilial]);
  }

  consultaElimininarSucursal(codigo: string) {
    this._sucursalService.getSucursalByCodigo(codigo).subscribe(
      (data: Sucursal) => {
        this.sucursal = data;
        Swal.fire({
          title: 'Desea eliminar la sucursal: ' + this.sucursal.nombre + ' .?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(codigo, this.sucursal.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Sucursal: ' + this.sucursal.nombre + ', no eliminada.',
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

  consultaElimininarTrabajadores(codigo: string) {
    this._sucursalService.getSucursalByCodigo(codigo).subscribe(
      (data: Sucursal) => {
        this.sucursal = data;
        Swal.fire({
          title:
            'Desea eliminar todos los trabajadores de la sucursal: ' +
            this.sucursal.nombre +
            ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminarTodosLosTrabajadores(codigo, this.sucursal.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Trabajadores de la sucursal: ' +
                this.sucursal.nombre +
                ', no eliminados.',
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

  eliminar(ruc: string, nombre: string) {
    this._sucursalService.deleteSucursal(ruc).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Sucursal: ' + nombre + ', eliminada satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        if (this.rol != 'Superadmin') this.getSucursalesByRuc();
        else this.getSucursales();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La Sucursal: ' +
              nombre +
              ' tiene trabajadores asociados, debe eliminarlos primero.',
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

  eliminarTodosLosTrabajadores(codigo: string, nombre: string) {
    this._personaService.deleteAllTrabajadoresSucursal(codigo).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text:
            'Todos los trabajadores de la Sucursal: ' +
            nombre +
            ', fueron eliminados satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        if (this.rol != 'Superadmin') this.getSucursalesByRuc();
        else this.getSucursales();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La Sucursal: ' +
              nombre +
              ', no tiene trabajadores asociados para eliminar.',
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

  detalle(codigo: string) {
    this.router.navigate(['/detallesSucursal/', codigo]);
  }
}
