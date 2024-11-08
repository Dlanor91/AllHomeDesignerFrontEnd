import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaDetalle } from 'src/app/Models/modeloPersonaDetalle';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-cliente',
  templateUrl: './detalles-cliente.component.html',
  styleUrls: ['./detalles-cliente.component.css'],
})
export class DetallesClienteComponent implements OnInit {
  id: string = '';
  persona: PersonaDetalle;

  constructor(
    private route: ActivatedRoute,
    private _personaService: PersonaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.id = id;
        this.getByCodigoPersona(this.id);
      }
    });
  }

  //#region Acciones de API
  getByCodigoPersona(codigo: string) {
    this._personaService.getPersonaByDocumento(codigo).subscribe(
      (data: PersonaDetalle) => {
        this.persona = data;
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
    this.router.navigate(['/clientes']);
  }
  //#endregion


}
