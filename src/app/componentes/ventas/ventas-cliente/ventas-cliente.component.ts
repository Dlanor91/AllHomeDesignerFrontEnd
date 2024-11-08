import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Persona } from 'src/app/Models/modeloCliente';
import { Venta } from 'src/app/Models/modeloVenta';
import { PersonaService } from 'src/app/services/persona.service';
import { VentasService } from 'src/app/services/ventas.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-cliente',
  templateUrl: './ventas-cliente.component.html',
  styleUrls: ['./ventas-cliente.component.css'],
})
export class VentasClienteComponent implements AfterViewInit {
  ventas: Venta[];
  venta: Venta;
  persona: Persona;
  documentoCliente: string;
  documentoProfesional: string;
  rucFilial: string;
  nombreCliente: string;

  displayedColumns: string[] = ['codigo', 'fecha', 'total', 'utiles'];
  dataSource: MatTableDataSource<Venta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _ventasService: VentasService,
    private _personasService: PersonaService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.documentoCliente = id;
      }
    });
    this.documentoProfesional = this.cookieService.get('documentoProfesional');
    this.rucFilial = this.cookieService.get('rucFilial');
    this.nombreCliente = "";
    this.getClienteByDocumento();
    this.getVentasCliente();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Acciones API

  getVentasCliente() {
    this._ventasService
      .getVentasCliente(
        this.documentoCliente,
        this.documentoProfesional,
        this.rucFilial
      )
      .subscribe(
        (data: Venta[]) => {
          this.ventas = data;
          this.dataSource = new MatTableDataSource(this.ventas);
          this.dataSource.paginator = this.paginator;
          this.paginator._intl = new paginacion();
        },
        (error: any) => {
          if (error.status === 400) {
            this.atras();
            Swal.fire({
              icon: 'info',
              title: '',
              text: this.nombreCliente + ` no tiene compras para mostrar.`,
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

  getClienteByDocumento() {
    this._personasService
      .getPersonaByDocumento(this.documentoCliente)
      .subscribe(
        (data: Persona) => {
          this.persona = data;
          this.nombreCliente =
            this.persona.nombre + ' ' + this.persona.apellido;
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

  consultaEliminar(codigo: string) {
    this._ventasService.getVentaByCodigo(codigo).subscribe(
      (data: Venta) => {
        this.venta = data;
        Swal.fire({
          title: 'Desea eliminar la venta código: ' + this.venta.codigo + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(codigo, this.venta.codigo);
          } else if (result.isDenied) {
            Swal.fire(
              'Venta: ' + this.venta.codigo + ' no eliminada.',
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
    this._ventasService.deleteVenta(codigo).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Venta: ' + nombre + ' eliminada satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getVentasCliente();
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error',
        });
      }
    );
  }

  detalle(codigo: string) {
    this.router.navigate(['/detallesVentas/', codigo]);
  }

  atras() {
    this.router.navigate(['/clientes']);
  }

  //#endregion
}
