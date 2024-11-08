import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Persona } from 'src/app/Models/modeloCliente';
import { ClienteRegistro } from 'src/app/Models/modeloClienteRegistro';
import { personaUpdate } from 'src/app/Models/modeloPersonaUpdate';
import { ClienteServices } from 'src/app/services/cliente.service';
import { PersonaService } from 'src/app/services/persona.service';
import { paginacion } from 'src/helpers/paginacion';
import { validarEmail, validarNombresDescripciones } from 'src/helpers/validaciones';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-personas',
  templateUrl: './listar-personas.component.html',
  styleUrls: ['./listar-personas.component.css'],
})
export class ListarPersonasComponent implements AfterViewInit {
  clientes: ClienteRegistro[];
  persona: Persona;
  detallesCliente: boolean;
  rol: string;

  displayedColumns: string[] = ['documento', 'nombre', 'email', 'utiles'];
  dataSource: MatTableDataSource<ClienteRegistro>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private cookieService: CookieService,
    private _clienteService: ClienteServices,
    private _personaService: PersonaService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.rol = this.cookieService.get('rol');
    this.detallesCliente = false;
    this.getClientes();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API

  agregarCliente() {
    this.router.navigate(['/registroCliente']);
  }

  getClientes() {
    this._clienteService.getClientes().subscribe(
      (data: ClienteRegistro[]) => {
        this.clientes = data;
        this.dataSource = new MatTableDataSource(this.clientes);
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
          title: 'Desea eliminar al cliente ' + this.persona.nombre + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(documento, this.persona.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Cliente: ' + this.persona.nombre + ', no eliminado.',
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
          text: 'Cliente: ' + nombre + ', eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getClientes();
      },
      (error: any) => {
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'El cliente: ' +
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

  detalle(cliente: string) {
    this._clienteService.getClienteByDoc(cliente).subscribe((data: any) => {
      let pers: Persona = {
        id: data.id,
        documento: data.documento,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefonos: data.telefonos,
        direcciones: data.direcciones,
        idTipoPersona: data.idTipoUsuario,
      };
      this.persona = data;
      this.detallesCliente = true;
    });
  }

  modificarPersona(persona: Persona): void {
    if (!validarNombresDescripciones(persona.nombre)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre con formato Inválido',
        text: 'El nombre no puede tener números, ni menos de 3 caracteres.',
      });
    } else if (!validarNombresDescripciones(persona.apellido)) {
      Swal.fire({
        icon: 'error',
        title: 'Apellido con formato Inválido',
        text: 'El apellido no puede tener números, ni menos de 3 caracteres.',
      });
    } else if (!validarEmail(persona.email)) {
      Swal.fire({
        icon: 'error',
        title: 'E-mail con formato Inválido',
        text: 'El e-mail ingresado no tiene un formato válido.',
      });
    } else {
    const pers: personaUpdate = {
      documento: persona.documento,
      nombre: persona.nombre,
      apellido: persona.apellido,
      email: persona.email,
    };

    this._clienteService
      .modificarPersonaByDoc(pers, persona.documento)
      .subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Datos Actualizados',
            text:
              'Datos de: ' +
              persona.nombre +
              ', actualizados satisfactoriamente.',
            color: '#85586F',
            iconColor: '#333',
          });
          this.detallesCliente = false;
          this.getClientes();
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
  }

  //#endregion

  //#region Acciones
  cancelar() {
    this.detallesCliente = false;
  }

  perfilCliente(documentoCliente: string) {
    this.router.navigate(['/detallesClientes', documentoCliente]);
  }

  compras(documentoCliente: string) {
    this.router.navigate(['/comprasCliente', documentoCliente]);
  }
  //#endregion
}
