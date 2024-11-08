import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { PrivilegioUpdate } from 'src/app/Models/modeloPrivilegioUpdate';
import { Privilegio } from 'src/app/Models/modeloPrivilegios';
import { PrivilegioService } from 'src/app/services/privilegios.service';
import { paginacion } from 'src/helpers/paginacion';
import { validarNombresDescripciones } from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-privilegios',
  templateUrl: './privilegios.component.html',
  styleUrls: ['./privilegios.component.css'],
})
export class PrivilegiosComponent implements OnInit {
  privilegios: Privilegio[];
  privilegio: Privilegio;
  detallesPrivilegio: boolean;

  displayedColumns: string[] = ['tipo', 'descripcion', 'utiles'];
  dataSource: MatTableDataSource<Privilegio>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _privilegioService: PrivilegioService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getPrivilegios();
  }

  ngAfterViewInit() {
    this.getPrivilegios();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API

  getPrivilegios() {
    this._privilegioService.getPrivilegios().subscribe(
      (data: Privilegio[]) => {
        this.privilegios = data;
        this.dataSource = new MatTableDataSource(this.privilegios);
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

  getPrivilegioById(id: number) {
    this._privilegioService.getPrivilegioById(id).subscribe(
      (data: Privilegio) => {
        this.privilegio = data;
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

  //#region Acciones

  agregarPrivilegio() {
    this.router.navigate(['/registrarPrivilegio']);
  }

  consultaEliminar(id: number) {
    this.detallesPrivilegio = false;
    this._privilegioService.getPrivilegioById(id).subscribe(
      (data: Privilegio) => {
        this.privilegio = data;
        Swal.fire({
          title: 'Desea eliminar el Privilegio: ' + this.privilegio.tipo + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(id, this.privilegio.tipo);
          } else if (result.isDenied) {
            Swal.fire(
              'Privilegio: ' + this.privilegio.tipo + ', no eliminado.',
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

  eliminar(id: number, tipo: string) {
    this._privilegioService.deletePrivilegio(id).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Privilegio: ' + tipo + ', eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getPrivilegios();
      },
      (err: any) => {
        if (err.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'El privilegio: ' +
              tipo +
              ', tiene tipos de usuarios asociados no se puede eliminar.',
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
    this.detallesPrivilegio = false;
    this._privilegioService.getPrivilegioById(id).subscribe((data: any) => {
      let privilegio: Privilegio = {
        id: data.id,
        tipo: data.tipo,
        descripcion: data.descripcion,
      };
      this.privilegio = privilegio;
      this.detallesPrivilegio = true;
    });
  }

  modificarPrivilegio(privilegioMod: Privilegio): void {
    if (!validarNombresDescripciones(privilegioMod.tipo)) {
      Swal.fire({
        icon: 'error',
        title: 'Tipo con formato Inválido',
        text: 'El tipo no puede tener números, ni menos de 3 caracteres.',
      });
    } else if (!validarNombresDescripciones(privilegioMod.descripcion)) {
      Swal.fire({
        icon: 'error',
        title: 'Descripión con formato Inválido',
        text: 'La descripción no puede tener números, ni menos de 3 caracteres.',
      });
    } else {
      const priv: PrivilegioUpdate = {
        tipo: privilegioMod.tipo,
        descripcion: privilegioMod.descripcion,
      };

      this._privilegioService
        .updatePrivilegio(priv, this.privilegio.id)
        .subscribe(
          (data: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Privilegio actualizado correctamente',
              text:
                'Los datos del privilegio: ' +
                priv.tipo +
                ', han sido actualizados satisfactoriamente.',
              color: '#85586F',
              iconColor: '#333',
            });
            this.detallesPrivilegio = false;
            this.getPrivilegios();
          },
          (error: any) => {
            if (error.status === 409) {
              Swal.fire({
                icon: 'error',
                title: 'Oops..',
                text:
                  'El privilegio: ' +
                  priv.tipo +
                  ', ya existe en nuestra base de datos.',
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
  }

  cancelar() {
    this.detallesPrivilegio = false;
  }

  //#endregion
}
