import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from 'src/app/Models/modeloCliente';
import { Sucursal } from 'src/app/Models/modeloSucursal';
import { Trabajador } from 'src/app/Models/modeloTrabajador';
import { PersonaService } from 'src/app/services/persona.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-trabajadores',
  templateUrl: './listar-trabajadores.component.html',
  styleUrls: ['./listar-trabajadores.component.css'],
})
export class ListarTrabajadoresComponent implements AfterViewInit {
  trabajadores: Trabajador[];
  trabajador: Persona;
  nombreSucursal: string;
  detallesPersona: boolean;
  codigo: string;

  displayedColumns: string[] = [
    'documento',
    'nombreCompleto',
    'usuario',
    'email',
    'utiles',
  ];
  dataSource: MatTableDataSource<Trabajador>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private _personaService: PersonaService,
    private _sucursalService: SucursalService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.route.paramMap.subscribe((params) => {
      const codigo = params.get('id');
      if (codigo !== null) {
        this.codigo = codigo;
      }
    });
    this.getTrabajadoresSucursales(this.codigo);
    this.getSucursalByCodigo(this.codigo);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API
  getTrabajadoresSucursales(codigo: string) {
    this._personaService.getAllTrabajadoresSucursal(codigo).subscribe(
      (data: Trabajador[]) => {
        this.trabajadores = data;
        this.dataSource = new MatTableDataSource(this.trabajadores);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl = new paginacion();
      },
      (error: any) => {
        if (error.status === 409) {
          this.volverSucursal(this.codigo);
          Swal.fire({
            title: 'No hay registros, desea ingresar un trabajador?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/registro', this.codigo]);
            } else if (result.isDenied) {
              Swal.fire('Sucursal sin trabajadores. ', '', 'info');
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al obtener los datos.',
          });
        }
      }
    );
  }

  getSucursalByCodigo(codigo: string) {
    this._sucursalService.getSucursalByCodigo(codigo).subscribe(
      (data: Sucursal) => {
        this.nombreSucursal = data.nombre;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos de la sucursal.',
        });
      }
    );
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
              'Trabajador: ' + this.trabajador.nombre + ' no eliminado.',
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
          text: 'Trabajador: ' + nombre + ' eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getTrabajadoresSucursales(this.codigo);
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
  //#region

  //#region Acciones

  volverSucursal(codigo: string) {
    this.router.navigate(['/detallesSucursal', codigo]);
  }

  agregarTrabajador() {
    this.router.navigate(['/registro', this.codigo]);
  }

  detalle(codigo: string) {
    this.router.navigate([
      '/detallesSucursal/mostrarTrabajadores/detalles/',
      codigo,
    ]);
  }

  //#region
}
