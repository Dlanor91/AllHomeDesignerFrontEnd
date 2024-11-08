import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Persona } from 'src/app/Models/modeloCliente';
import { Trabajador } from 'src/app/Models/modeloTrabajador';
import { PersonaService } from 'src/app/services/persona.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css'],
})
export class ListarUsuariosComponent implements AfterViewInit {
  personas: Trabajador[];
  persona: Persona;

  datosModificadosCorrectamente: boolean = false;
  noContieneNumeros: boolean = true;
  menosCaracteres: boolean = true;

  displayedColumns: string[] = [
    'cedula',
    'nombre',
    'nombreUsuario',
    'rol',
    'utiles',
  ];
  dataSource: MatTableDataSource<Trabajador>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _personaService: PersonaService,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.getUsuarios();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API

  agregarUsuario() {
    this.router.navigate(['/registro/user']);
  }

  detalle(codigo: string){
    this.router.navigate(['/usuarios/detalles/', codigo]);
  }

  getUsuarios() {
    this._personaService.getAllUsuarios().subscribe(
      (data: Trabajador[]) => {
        this.personas = data;
        this.dataSource = new MatTableDataSource(this.personas);
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

  consultaEliminar(documento: string) {
    this._personaService.getPersonaByDocumento(documento).subscribe(
      (data: Persona) => {
        this.persona = data;
        Swal.fire({
          title: 'Desea eliminar el usuario: ' + this.persona.nombre + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(documento, this.persona.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'usuario: ' + this.persona.nombre + ' no eliminado.',
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

  eliminar(documento: string, nombre: string) {
    this._personaService.deletePersonaByDoc(documento).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Usuario: ' + nombre + ' eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getUsuarios();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'El usuario: ' +
              nombre +
              ', tiene reservas asociadas, debe eliminarlas primero.',
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
  //#endregion
}
