import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  DepartamentosRequest,
  LocalidadesRequest,
} from 'src/app/interfaces/departamentos_localidades_request';
import { DireccionRequest } from 'src/app/interfaces/direccion_request';
import { DireccionSucursalRequest } from 'src/app/interfaces/direccion_sucursal_request';
import { RegistroSucursalRequest } from 'src/app/interfaces/registro_sucursal_request ';
import { RegistroSucursalTelefonoRequest } from 'src/app/interfaces/registro_sucursal_telefono';
import { RegistroTelefonoRequest } from 'src/app/interfaces/registro_telefono';
import { AuthService } from 'src/app/services/auth.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-sucursal',
  templateUrl: './registrar-sucursal.component.html',
  styleUrls: ['./registrar-sucursal.component.css'],
})
export class RegistrarSucursalComponent implements OnInit {
  formulario!: FormGroup;
  rucFilial: string;

  seleccionDepartamento: DepartamentosRequest = {
    id: 0,
    nombre: '',
    localidades: [],
  };
  seleccionLocalidad: LocalidadesRequest = { id: 0, nombre: '' };
  departamentos: DepartamentosRequest[];
  localidades: LocalidadesRequest[];

  telefono = {
    numero: '',
    documentoPersona: '',
  };

  direccion = {
    calle: '',
    nroPuerta: 0,
    datos: '',
    complemento: '',
    documentoPersona: '',
    idLocalidad: 0,
  };

  form = {
    codigo: '',
    nombre: '',
    email: '',
    detalles: '',
    idTelefono: '',
    idDireccion: '',
  };

  constructor(
    private sucursalService: SucursalService,
    private router: Router,
    private route: ActivatedRoute,
    private service: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.rucFilial = id;
      }
    });

    this.formulario = new FormGroup({
      codigo: new FormControl(this.form.codigo, [Validators.required]),
      nombre: new FormControl(this.form.nombre, [Validators.required]),

      email: new FormControl(this.form.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      detalles: new FormControl(this.form.detalles, [Validators.required]),
      numero: new FormControl(this.telefono.numero),
      calle: new FormControl(this.direccion.calle),
      nroPuerta: new FormControl(this.direccion.nroPuerta),
      datos: new FormControl(this.direccion.datos),
      complemento: new FormControl(this.direccion.complemento),
      idLocalidad: new FormControl(this.direccion.idLocalidad),
    });

    this.retornarDepartamentos();
  }

  onSelectDepto(event: any): void {
    this.service.getLocalidades(event.id).subscribe({
      next: (data) => {
        this.localidades = data.localidades;
      },
    });
  }

  retornarDepartamentos() {
    this.service.getDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
    });
  }

  get codigo() {
    return this.formulario.get('codigo')!;
  }
  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get email() {
    return this.formulario.get('email')!;
  }
  get detalles() {
    return this.formulario.get('detalles')!;
  }
  get idTelefono() {
    return this.formulario.get('idTelefono')!;
  }
  get idDireccion() {
    return this.formulario.get('idDireccion')!;
  }

  enviar() {
    let modelo: RegistroSucursalRequest = {
      codigo: this.formulario.value.codigo.toUpperCase(),
      nombre: this.formulario.value.nombre,
      email: this.formulario.value.email,
      detalles: this.formulario.value.detalles,
    };
    let modeloTelefono: RegistroSucursalTelefonoRequest = {
      numero: this.formulario.value.numero,
      codigoSucursal: this.formulario.value.codigo.toUpperCase(),
      rucEmpresa:"",
      documentoPersona:""
    };

    let modeloDireccion: DireccionSucursalRequest = {
      calle: this.formulario.value.calle,
      nroPuerta: this.formulario.value.nroPuerta,
      datos: this.formulario.value.datos,
      complemento: this.formulario.value.complemento,
      idLocalidad: this.formulario.value.idLocalidad.id,
      codigoSucursal: this.formulario.value.codigo.toUpperCase(),
    };

    this.sucursalService
      .postSucursalPorRucFilial(this.rucFilial, modelo)
      .subscribe({
        next: (data) => {
          if (data != null) {
            if (modeloTelefono.numero != '') {
              this.service.registroTelefonoPorRuc(modeloTelefono).subscribe({});
            }
            if (modeloDireccion.calle != '') {
              this.service.registroCallePorRuc(modeloDireccion).subscribe({});
            }

            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Registro con exito',
            });
            this.router.navigate(['/sucursales']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ups! ',
              text: data,
            });
          }
        },
        error: (error) => {
          if (error.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Oops..',
              text:
                'Ya existe una filial ingresada con ese ruc: ' + modelo + ' .',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops..',
              text: 'Error',
            });
          }
        },
      });
  }
}
