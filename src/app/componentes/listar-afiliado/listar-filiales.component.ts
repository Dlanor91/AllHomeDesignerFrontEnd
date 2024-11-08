import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Filial } from 'src/app/Models/modeloFilial';
import { FilialService } from 'src/app/services/filial.service';
import { paginacion } from 'src/helpers/paginacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-afiliado',
  templateUrl: './listar-filiales.component.html',
  styleUrls: ['./listar-filiales.component.css'],
  providers: [FilialService],
})
export class ListarAfiliadoComponent implements AfterViewInit {
  filiales: Filial[];
  filial: Filial;
  detallesFiliales: boolean;

  displayedColumns: string[] = ['ruc', 'nombre', 'estado', 'utiles'];
  dataSource: MatTableDataSource<Filial>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _filialService: FilialService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.getFilial();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //#region Datos de API

  getFilial() {
    this._filialService.getFilial().subscribe(
      (data: Filial[]) => {
        this.filiales = data;
        this.dataSource = new MatTableDataSource(this.filiales);
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

  //#region Acciones con las filiales

  agregarFilial(){
    this.router.navigate(['/registroFilial']);
  }

  consultaElimininarFilial(ruc: string) {
    this._filialService.getFilialByRuc(ruc).subscribe(
      (data: Filial) => {
        this.filial = data;
        Swal.fire({
          title:
            'Desea eliminar la filial: ' +
            this.filial.nombre +
            ' ?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.eliminar(ruc, this.filial.nombre);
          } else if (result.isDenied) {
            Swal.fire(
              'Filial: ' +
                this.filial.nombre +
                ' no eliminada.',
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
    this._filialService.deleteFilial(ruc).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos Eliminados',
          text: 'Filial: ' + nombre + ' eliminada satisfactoriamente.',
          color: '#85586F',
          iconColor: '#333',
        });
        this.getFilial();
      },
      (err: any) => {
        if (err.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text:
              'La Filial: ' +
              nombre +
              ' tiene sucursales asociadas, no se puede eliminar.',
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

  detalle(id: string) {
    this.router.navigate(['/editarFilial/', id]);
  }

  //#endregion
}
