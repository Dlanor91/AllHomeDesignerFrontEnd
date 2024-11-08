import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaDetalle } from 'src/app/Models/modeloVentaDetalle';
import { VentasService } from 'src/app/services/ventas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-ventas',
  templateUrl: './detalles-ventas.component.html',
  styleUrls: ['./detalles-ventas.component.css'],
})
export class DetallesVentasComponent implements OnInit {
  id: string = '';
  detallesVentas: VentaDetalle[];

  constructor(
    private _ventasService: VentasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
      }
    });
    this.getDetallesCompra(this.id);
  }

  //#region Acciones de API
  getDetallesCompra(codigo: string) {
    this._ventasService.getDetallesVentas(codigo).subscribe(
      (data: VentaDetalle[]) => {
        this.detallesVentas = data;
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

  //#region  Acciones
  atras() {
    this.router.navigate(['/ventas']);
  }
  //#endregion
}
