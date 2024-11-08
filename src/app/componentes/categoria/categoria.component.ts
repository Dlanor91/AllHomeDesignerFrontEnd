import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Categoria } from 'src/app/Models/modeloCategoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ProductosServices } from 'src/app/services/productos.service';
import { Router } from '@angular/router';
import { paginacion } from 'src/helpers/paginacion';
import { validarNombresDescripciones } from 'src/helpers/validaciones';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent implements AfterViewInit {
  categorias: Categoria[];
  categoria: Categoria;
  detallesCategoria: boolean;

  displayedColumns: string[] = ['nombre', 'descripcion', 'utiles'];
  dataSource: MatTableDataSource<Categoria>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _categoriaService: CategoriaService,
    private _productosService: ProductosServices,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.getCategorias();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API

  agregarCategoria() {
    this.router.navigate(['/registrarCategoria']);
  }

  getCategorias() {
    this._categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
        this.dataSource = new MatTableDataSource(this.categorias);
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

  getCategoriaById(id: number) {
    this._categoriaService.getCategoriaById(id).subscribe(
      (data: Categoria) => {
        this.categoria = data;
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

  //#endregion

  //#region Acciones

  consultaEliminar(id: number) {
    this.detallesCategoria = false;
    this._categoriaService.getCategoriaById(id).subscribe(
      (data: Categoria) => {
        this.categoria = data;
        Swal.fire({
          title: 'Desea eliminar la Categoría: ' + this.categoria.nombre + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(id, this.categoria.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Categoría: ' + this.categoria.nombre + ', no eliminada.',
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

  consultaElimininarProductos(id: number) {
    this.detallesCategoria = false;
    this._categoriaService.getCategoriaById(id).subscribe(
      (data: Categoria) => {
        this.categoria = data;
        Swal.fire({
          title:
            'Desea eliminar todos los productos de la Categoría: ' +
            this.categoria.nombre +
            ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminarTodosLosProductos(id, this.categoria.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Productos de la categoría: ' +
                this.categoria.nombre +
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

  eliminar(id: number, nombre: string) {
    this._categoriaService.deleteCategoria(id).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Categoría: ' + nombre + ', eliminada satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getCategorias();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La categoría: ' +
              nombre +
              ', tiene productos asociados, debe eliminarlos primero.',
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

  eliminarTodosLosProductos(id: number, nombre: string) {
    this._productosService.deleteAllProductosByIdCategoria(id).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text:
            'Todos los productos de la Categoría: ' +
            nombre +
            ', eliminados satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getCategorias();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La categoría: ' +
              nombre +
              ', no tiene productos asociados para eliminar.',
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

  detalle(id: number) {
    this.detallesCategoria = false;
    this._categoriaService.getCategoriaById(id).subscribe((data: any) => {
      let categoria: Categoria = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
      };
      this.categoria = categoria;
      this.detallesCategoria = true;
    });
  }

  modificarCategoria(categoriaMod: Categoria): void {
    if (!validarNombresDescripciones(categoriaMod.nombre)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre con formato Inválido',
        text: 'El nombre no puede tener números, ni menos de 3 caracteres.',
      });
    } else if(!validarNombresDescripciones(categoriaMod.descripcion)){
      Swal.fire({
        icon: 'error',
        title: 'Descripción con formato Inválido',
        text: 'La descripción no puede tener números, ni menos de 3 caracteres.',
      });
    }else{
      const cat: Categoria = {
        id: categoriaMod.id,
        nombre: categoriaMod.nombre,
        descripcion: categoriaMod.descripcion,
      };
      this._categoriaService.updateCategoria(cat, cat.id).subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Categoria actualizada correctamente',
            text:
              'Los datos de la categoría: ' +
              cat.nombre +
              ', han sido actualizados satisfactoriamente.',
            color: '#85586F',
            iconColor: '#333',
          });
          this.detallesCategoria = false;
          this.getCategorias();
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'La categoría: ' + cat.nombre + ', no pudo ser modificada.',
          });
        }
      );
    }
  }

  cancelar() {
    this.detallesCategoria = false;
  }

  //#endregion
}
