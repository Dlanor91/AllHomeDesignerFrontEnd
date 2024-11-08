import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Mensaje } from 'src/app/Models/modeloMensaje';
import { ContactoService } from 'src/app/services/contacto.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MensajesComponent implements OnInit {
  mensajes: Mensaje[];
  mensaje: Mensaje;

  constructor(
    private _mensajeService: ContactoService,
    private paginatorIntl: MatPaginatorIntl
  ) {}

  columnsToDisplay = ['nombre', 'email', 'telefono', 'utiles'];
  dataSource: MatTableDataSource<Mensaje>;
  expandedElement: Mensaje | null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getMensajes();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API
  getMensajes() {
    this._mensajeService.getMensajes().subscribe(
      (data: Mensaje[]) => {
        this.mensajes = data;
        this.dataSource = new MatTableDataSource(this.mensajes);
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

  //#region Acciones con los clientes

  consultaEliminar(id: number) {
    this._mensajeService.getMensajesById(id).subscribe(
      (data: Mensaje) => {
        this.mensaje = data;
        Swal.fire({
          title: 'Desea eliminar el mensaje de: ' + this.mensaje.nombre + ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(id, this.mensaje.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Mensaje de: ' + this.mensaje.nombre + ' no eliminado.',
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
    this._mensajeService.deleteMensaje(id).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Mensaje de: ' + nombre + ' eliminado satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getMensajes();
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

  //#endregion
}
