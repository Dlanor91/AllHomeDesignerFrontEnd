import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Empresa } from 'src/app/Models/modeloEmpresa';
import { Venta } from 'src/app/Models/modeloVenta';
import { EmpresaService } from 'src/app/services/empresa.service';
import { VentasService } from 'src/app/services/ventas.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-empresa',
  templateUrl: './ventas-empresa.component.html',
  styleUrls: ['./ventas-empresa.component.css']
})
export class VentasEmpresaComponent implements AfterViewInit {
  ventas: Venta[];
  venta: Venta;
  empresa: Empresa;
  rucEmpresa: string;
  documentoProfesional: string;
  rucFilial: string;
  razonSocial: string;

  displayedColumns: string[] = ['codigo', 'fecha', 'total', 'utiles'];
  dataSource: MatTableDataSource<Venta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _ventasService: VentasService,
    private _empresaService: EmpresaService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.rucEmpresa = id;
      }
    });
    this.documentoProfesional = this.cookieService.get('documentoProfesional');
    this.rucFilial = this.cookieService.get('rucFilial');
    this.razonSocial = "";
    this.getClienteByDocumento();
    this.getVentasEmpresa();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Acciones API

  getVentasEmpresa() {
    this._ventasService
      .getVentasEmpresa(
        this.rucEmpresa,
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
              text: this.razonSocial + ` no tiene compras para mostrar.`,
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
    this._empresaService
      .getEmpresaByRuc(this.rucEmpresa)
      .subscribe(
        (data: Empresa) => {
          this.empresa = data;
          this.razonSocial =
            this.empresa.razonSocial;
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
        this.getVentasEmpresa();
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
