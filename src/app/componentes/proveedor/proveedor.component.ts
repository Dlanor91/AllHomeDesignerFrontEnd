import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Proveedor } from 'src/app/Models/modeloProveedor';
import { ProveedorUpdate } from 'src/app/Models/modeloProveedorUpdate';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { paginacion } from 'src/helpers/paginacion';
import { validarNombresDescripciones } from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements AfterViewInit {
  proveedores: Proveedor[];
  proveedor: Proveedor;
  detallesProveedor: boolean;

  displayedColumns: string[] = ['ruc', 'nombre', 'utiles'];
  dataSource: MatTableDataSource<Proveedor>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.getProveedores();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  agregarProveedor() {
    this.router.navigate(['/registrarProveedor']);
  }

  //#region Datos de API

  getProveedores() {
    this._proveedorService.getProveedor().subscribe(
      (data: Proveedor[]) => {
        this.proveedores = data;
        this.dataSource = new MatTableDataSource(this.proveedores);
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

  //#region Acciones con los Proveedores

  consultaEliminar(ruc: string) {
    this.detallesProveedor = false;
    this._proveedorService.getProveedorById(ruc).subscribe(
      (data: Proveedor) => {
        this.proveedor = data;
        Swal.fire({
          title: 'Desea eliminar el Proveedor: ' + this.proveedor.nombre + ' .?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(ruc, this.proveedor.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Proveedor: ' + this.proveedor.nombre + ', no eliminado.',
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
    this._proveedorService.deleteProveedora(ruc).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Proveedor: ' + nombre + ', eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getProveedores();
      },
      (err: any) => {
        if (err.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'El proveedor: ' +
              nombre +
              ', tiene productos asociados y no se puede eliminar.',
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

  editar(ruc: string) {
    this.detallesProveedor = false;
    this._proveedorService.getProveedorById(ruc).subscribe((data: any) => {
      let prov: Proveedor = {
        id: data.id,
        ruc: data.ruc,
        nombre: data.nombre,
      };
      this.proveedor = prov;
      this.detallesProveedor = true;
    });
  }

  modificarProveedor(provUpdate: Proveedor): void {

    if(!validarNombresDescripciones(provUpdate.nombre)){
      Swal.fire({
        icon: 'error',
        title: 'Nombre con formato Inválido',
        text: 'El nombre no puede tener números, ni menos de 3 caracteres.',
      });
    }else{
      const prov: ProveedorUpdate = {
        nombre: provUpdate.nombre,
      };

      this._proveedorService.updateProveedor(prov, this.proveedor.ruc).subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor actualizada correctamente',
            text:
              'Los datos del proveedor: ' +
              provUpdate.nombre +
              ', han sido actualizados satisfactoriamente.',
            color: '#85586F',
            iconColor: '#333',
          });
          this.detallesProveedor = false;
          this.getProveedores();
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'El proveeddor: ' + provUpdate.nombre + ', no pudo ser modificado.',
          });
        }
      );
    }
  }

  cancelar() {
    this.detallesProveedor = false;
  }

  //#endregion
}
