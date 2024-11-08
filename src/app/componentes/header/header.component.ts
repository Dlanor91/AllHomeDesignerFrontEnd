import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Persona } from 'src/app/Models/modeloCliente';
import { Mensaje } from 'src/app/Models/modeloMensaje';
import { ContactoService } from 'src/app/services/contacto.service';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private intervalId: any;
  logueado: boolean;
  nombre: string;
  administrador: boolean;
  vendedor: boolean;
  rol: string;
  codigoSucursal: string;
  nombreUsuario: string;
  persona: Persona;
  hidden = false;
  conteoMensajes: number;
  rucFilial: string;

  constructor(
    private _personaService: PersonaService,
    private _mensajeService: ContactoService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.cookieService.check('token')) {
      this.logueado = true;
      this.nombre = this.cookieService.get('nombreCompleto');
      this.nombreUsuario = this.cookieService.get('nombreUsuario');
      this.rol = this.cookieService.get('rol');
      this.rucFilial = this.cookieService.get('rucFilial');
      this.codigoSucursal = this.cookieService.get('codigoSucursal');
      this.getDatosUsuarioByUserName(this.nombreUsuario);
      if (this.rol === 'Superadmin') {
        this.getMensajesTotal();
        this.startInterval();
      }
    } else {
      this.logueado = false;
    }
  }

  ngOnDestroy() {
    this.stopInterval();
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  //#region Reinicio de pagina

  startInterval() {
    this.intervalId = setInterval(() => {
      this.getMensajesTotal();
    }, 60 * 60 * 1000);
  }

  stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  //#endregion

  //#region  Datos Api
  getDatosUsuarioByUserName(nombreUsuario: string) {
    this._personaService.getPersonaByUserName(nombreUsuario).subscribe(
      (data: Persona) => {
        this.persona = data;
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

  getMensajesTotal() {
    this._mensajeService.getMensajes().subscribe(
      (data: Mensaje[]) => {
        this.conteoMensajes = data.length;
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
  salir() {
    this.cookieService.deleteAll();
    localStorage.removeItem('miCarrito');
    Swal.fire({
      icon: 'success',
      title: 'OK',
      text: 'Sesión finalizada',
      color: '#333',
      iconColor: '#333',
    }).then(() => {
      this.router.navigate(['']).then(() => {
        window.location.reload();
      });
    });
  }

  perfil(documento: string) {
    this.router.navigate(['/perfil', documento]);
  }
  //#endregion
}
