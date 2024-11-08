import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Producto } from 'src/app/Models/modeloProducto';
import { ProductosServices } from 'src/app/services/productos.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css'],
})
export class ListarProductosComponent implements AfterViewInit {
  productos: Producto[];
  unProducto: Producto;
  detallesProductos: boolean;
  rucFilial: string;
  rol: string;

  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'stock',
    'disponibilidad',
    'precio',
    'utiles',
  ];
  dataSource: MatTableDataSource<Producto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _productoServices: ProductosServices,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.rol = this.cookieService.get('rol');
    this.rucFilial = this.cookieService.get('rucFilial');
    if (this.rucFilial == 'null') this.getProductos();
    else this.getProductosByRucFilial(this.rucFilial);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API

  //#region Datos desde la API o LocalStorage
  getProductos() {
    this._productoServices.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl = new paginacion();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al obtener los datos de los productos',
        });
      }
    );
  }

  getProductosByRucFilial(rucFilial: string) {
    this._productoServices.getProductosByFilial(rucFilial).subscribe(
      (data: Producto[]) => {
        this.productos = data;
        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl = new paginacion();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al obtener los datos de los productos por filial.',
        });
      }
    );
  }

  //#endregion

  //#region
  consultaEliminar(codigo: string, rucProveedor: string) {
    this._productoServices.getProductoByCodigo(codigo, rucProveedor).subscribe(
      (data: Producto) => {
        this.unProducto = data;
        Swal.fire({
          title: 'Desea eliminar el Producto: ' + this.unProducto.nombre + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(codigo, rucProveedor, this.unProducto.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Producto: ' + this.unProducto.nombre + ' no eliminado.',
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

  eliminar(codigo: string, rucProveedor: string, nombre: string) {
    this._productoServices.deleteProducto(codigo, rucProveedor).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Producto: ' + nombre + ' eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });

        if (this.rucFilial == 'null') {
          this.getProductos();
        } else {
          this.getProductosByRucFilial(this.rucFilial);
        }
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La categoría: ' +
              nombre +
              ' tiene productos asociados, debe eliminarlos primero.',
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

  agregarProducto() {
    this.router.navigate(['/agregarProductos/']);
  }

  detalle(codigo: string, rucProveedor: string) {
    this.router.navigate(['/editarProductos/', codigo, rucProveedor]);
  }
  //#endregion
}
