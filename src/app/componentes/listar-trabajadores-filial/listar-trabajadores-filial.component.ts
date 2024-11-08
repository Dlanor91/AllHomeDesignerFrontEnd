import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Persona } from 'src/app/Models/modeloCliente';
import { Filial } from 'src/app/Models/modeloFilial';
import { Trabajador } from 'src/app/Models/modeloTrabajador';
import { FilialService } from 'src/app/services/filial.service';
import { PersonaService } from 'src/app/services/persona.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-trabajadores-filial',
  templateUrl: './listar-trabajadores-filial.component.html',
  styleUrls: ['./listar-trabajadores-filial.component.css'],
})
export class ListarTrabajadoresFilialComponent implements AfterViewInit {
  rucFilial: string;
  trabajadores: Trabajador[];
  trabajador: Persona;
  filial: Filial;
  nombre: string;
  codigoSucursal: string;

  displayedColumns: string[] = ['codigo', 'nombre', 'rol', 'utiles'];
  dataSource: MatTableDataSource<Trabajador>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _filialService: FilialService,
    private _personaService: PersonaService,
    private cookieServices: CookieService,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.rucFilial = this.cookieServices.get('rucFilial');
    this.codigoSucursal = this.cookieServices.get('codigoSucursal');
    this.getTrabajadoresByRucFilial();
    this.getFilialById();
    console.log(this.filial);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos API
  getTrabajadoresByRucFilial() {
    this._personaService.getAllTrabajadoresFilial(this.rucFilial).subscribe(
      (data: Trabajador[]) => {
        this.trabajadores = data;
        this.dataSource = new MatTableDataSource(this.trabajadores);
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

  getFilialById() {
    this._filialService.getFilialByRuc(this.rucFilial).subscribe(
      (data: Filial) => {
        this.filial = data;
        this.nombre = this.filial.nombre;
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
  annadirTrabajador() {
    this.router.navigate(['/registro', this.codigoSucursal]);
  }

  detalle(codigo: string) {
    this.router.navigate([
      '/detallesSucursal/mostrarTrabajadores/detalles/',
      codigo,
    ]);
  }

  consultaEliminar(documento: string) {
    this._personaService.getPersonaByDocumento(documento).subscribe(
      (data: Persona) => {
        this.trabajador = data;
        Swal.fire({
          title:
            'Desea eliminar el Trabajador: ' + this.trabajador.nombre + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(documento, this.trabajador.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Trabajador: ' + this.trabajador.nombre + ', no eliminado.',
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

  eliminar(codigo: string, nombre: string) {
    this._personaService.deletePersonaByDoc(codigo).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Trabajador: ' + nombre + ', eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getTrabajadoresByRucFilial();
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
