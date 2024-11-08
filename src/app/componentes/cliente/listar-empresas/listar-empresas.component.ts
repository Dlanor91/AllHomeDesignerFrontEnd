import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ClienteRegistroEmpresa } from 'src/app/Models/modeloClienteRegistroEmpresa';
import { Empresa } from 'src/app/Models/modeloEmpresa';
import { empresaUpdate } from 'src/app/Models/modeloEmpresaUpdate';
import { ClienteServices } from 'src/app/services/cliente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { paginacion } from 'src/helpers/paginacion';
import {
  validarEmail,
  validarNombresDescripciones,
} from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.css'],
})
export class ListarEmpresasComponent implements AfterViewInit {
  empresas: ClienteRegistroEmpresa[];
  empresa: Empresa;
  detalleEmpresa: boolean;

  rol: string;

  displayedColumns: string[] = ['ruc', 'nombre', 'razon', 'email', 'utiles'];
  dataSource: MatTableDataSource<ClienteRegistroEmpresa>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private cookieService: CookieService,
    private _clienteService: ClienteServices,
    private _empresaService: EmpresaService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.rol = this.cookieService.get('rol');
    this.getEmpresas();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API
  getEmpresas() {
    this._clienteService.getEmpresas().subscribe(
      (data: ClienteRegistroEmpresa[]) => {
        this.empresas = data;
        this.dataSource = new MatTableDataSource(this.empresas);
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
  //#endregion

  //#region Acciones
  agregarEmpresa() {
    this.router.navigate(['/registroEmpresa']);
  }

  consultaEliminar(ruc: string) {
    this._empresaService.getEmpresaByRuc(ruc).subscribe(
      (data: Empresa) => {
        this.empresa = data;
        Swal.fire({
          title: 'Desea eliminar la Empresa: ' + this.empresa.nombre + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(ruc, this.empresa.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Empresa: ' + this.empresa.nombre + ', no eliminada.',
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
    this._clienteService.deleteEmpresaByRuc(ruc).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Empresa: ' + nombre + ', eliminada satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getEmpresas();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La empresa: ' +
              nombre +
              ', tiene reservas asociados, debe eliminarlas primero.',
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

  detalle(ruc: string) {
    this._clienteService.getEmpresaByRuc(ruc).subscribe((data: any) => {
      let empresa = {
        id: data.id,
        ruc: data.ruc,
        nombre: data.nombre,
        razonSocial: data.razonSocial,
        email: data.email,
        telefonos: data.telefonos,
        direcciones: data.direcciones,
        idTipoPersona: data.idTipoUsuario,
      };
      this.empresa = empresa;
      this.detalleEmpresa = true;
    });
  }

  modificarEmpresa(empresa: Empresa): void {
    if (!validarNombresDescripciones(empresa.nombre)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre con formato Inválido',
        text: 'El nombre no puede tener números, ni menos de 3 caracteres.',
      });
    } else if (!validarNombresDescripciones(empresa.razonSocial)) {
      Swal.fire({
        icon: 'error',
        title: 'Razón Social con formato Inválido',
        text: 'La razón social no puede tener números, ni menos de 3 caracteres.',
      });
    } else if (!validarEmail(empresa.email)) {
      Swal.fire({
        icon: 'error',
        title: 'E-mail con formato Inválido',
        text: 'El e-mail ingresado no tiene un formato válido.',
      });
    } else {
      const emp: empresaUpdate = {
        ruc: empresa.ruc,
        nombre: empresa.nombre,
        razonSocial: empresa.razonSocial,
        email: empresa.email,
        comentarios: '',
      };

      this._clienteService.modificarEmpresaByRuc(emp, empresa.ruc).subscribe(
        (data: any) => {
          if (data.mensaje != '')
            Swal.fire({
              icon: 'success',
              title: 'Datos Actualizados',
              text:
                'Datos de: ' +
                empresa.nombre +
                ', actualizados satisfactoriamente.',
              color: '#85586F',
              iconColor: '#333',
            });
          this.detalleEmpresa = false;
          this.getEmpresas();
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'No se han podido actualizar los datos correctamente.',
          });
        }
      );
    }
  }

  cancelar() {
    this.detalleEmpresa = false;
  }

  compras(rucEmpresa: string) {
    this.router.navigate(['/comprasEmpresa', rucEmpresa]);
  }
  //#endregion
}
