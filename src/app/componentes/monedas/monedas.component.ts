import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Moneda } from 'src/app/Models/modeloMoneda';
import { MonedaUpdate } from 'src/app/Models/modeloMonedaUpdate';
import { MonedaService } from 'src/app/services/moneda.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.css'],
})
export class MonedasComponent implements AfterViewInit {
  monedas: Moneda[];
  moneda: Moneda;
  monedaUpdate: MonedaUpdate;
  detallesMoneda: boolean;

  displayedColumns: string[] = [
    'simbolo',
    'codigo',
    'descripcion',
    'cotizacion',
    'fecha',
    'utiles',
  ];
  dataSource: MatTableDataSource<Moneda>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _monedaService: MonedaService, private router: Router) {}

  ngAfterViewInit() {
    this.getMonedas();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  agregarMoneda() {
    this.router.navigate(['/registrarMoneda']);
  }

  //#region Datos de API

  getMonedas() {
    this._monedaService.getMonedas().subscribe(
      (data: Moneda[]) => {
        this.monedas = data;
        this.dataSource = new MatTableDataSource(this.monedas);
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

  getMonedaById(codigo: string) {
    this._monedaService.getMonedaById(codigo).subscribe(
      (data: Moneda) => {
        this.moneda = data;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al cargar los datos.',
        });
      }
    );
  }

  //#region Acciones con los clientes

  consultaEliminar(codigo: string) {
    this._monedaService.getMonedaById(codigo).subscribe(
      (data: Moneda) => {
        this.moneda = data;
        Swal.fire({
          title: 'Desea eliminar la moneda: ' + this.moneda.descripcion + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(codigo, this.moneda.descripcion);
          } else if (result.isDenied) {
            Swal.fire(
              'Moneda: ' + this.moneda.descripcion + ', no eliminada.',
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

  eliminar(codigo: string, descripcion: string) {
    this._monedaService.deleteCategoria(codigo).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Moneda: ' + descripcion + ', eliminada satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getMonedas();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La moneda: ' +
              descripcion +
              ', tiene productos con precios asociados y no se puede eliminar.',
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

  editar(codigo: string) {
    this.detallesMoneda = false;
    this._monedaService.getMonedaById(codigo).subscribe((data: any) => {
      let moneda: MonedaUpdate = {
        cotizacion: data.cotizacion,
        fecha: data.fecha,
      };
      this.moneda = data;
      this.monedaUpdate = moneda;
      this.detallesMoneda = true;
    });
  }

  modificarMoneda(monedaMod: MonedaUpdate): void {
    if (monedaMod.cotizacion <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Cotización inválida',
        text: 'La cotización no puede ser menor o igual a 0.',
      });
    } else {
      const mon: MonedaUpdate = {
        cotizacion: monedaMod.cotizacion,
        fecha: monedaMod.fecha,
      };

      if (mon.fecha === this.moneda.fecha) mon.fecha = new Date();

      this._monedaService.updateMoneda(mon, this.moneda.codigo).subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Moneda actualizada correctamente',
            text:
              'Los datos de la moneda: ' +
              this.moneda.descripcion +
              ', han sido actualizados satisfactoriamente.',
            color: '#85586F',
            iconColor: '#333',
          });
          this.detallesMoneda = false;
          this.getMonedas();
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La moneda: ' +
              this.moneda.descripcion +
              ', no pudo ser modificada.',
          });
        }
      );
    }
  }

  cancelar() {
    this.detallesMoneda = false;
  }

  //#endregion
}
