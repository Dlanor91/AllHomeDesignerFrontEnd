import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Venta } from 'src/app/Models/modeloVenta';
import { VentasService } from 'src/app/services/ventas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-profesional',
  templateUrl: './ventas-profesional.component.html',
  styleUrls: ['./ventas-profesional.component.css']
})
export class VentasProfesionalComponent implements AfterViewInit {
  ventas: Venta[];
  venta: Venta;
  documentoProfesional: string;

  displayedColumns: string[] = [
    'codigo',
    'fecha',
    'cliente',
    'empresa',
    'total',
    'utiles',
  ];
  dataSource: MatTableDataSource<Venta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _ventasService: VentasService,
    private paginatorIntl: MatPaginatorIntl,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.documentoProfesional = this.cookieService.get('documentoProfesional');
    this.getVentasProfesional();
    this.paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Acciones API

  getVentasProfesional() {
    this._ventasService.getVentasByProfesional(this.documentoProfesional).subscribe(
      (data: Venta[]) => {
        this.ventas = data;
        this.dataSource = new MatTableDataSource(this.ventas);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        if(error.status === 400){
          Swal.fire({
            icon: 'info',
            title: 'No hay datos',
            text: 'No hay ventas para mostrar.',
          });
          this.router.navigate(['/home']);
        }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos.',
        });
      }
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
        this.getVentasProfesional();
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

  detalle(codigo: string){
    this.router.navigate(['/detallesVentas/', codigo]);
  }

  //#endregion

}
