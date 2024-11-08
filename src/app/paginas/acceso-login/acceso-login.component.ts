import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginRequest } from 'src/app/interfaces/login_request';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acceso-login',
  templateUrl: './acceso-login.component.html',
  styleUrls: ['./acceso-login.component.css'],
})
export class AccesoLoginComponent implements OnInit {
  formulario!: FormGroup;
  hide = true;

  form = {
    nombreUsuario: '',
    password: '',
  };

  boolUsu = false;
  boolCli = false;
  idTipoUsuario: Number;
  constructor(
    private service: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombreUsuario: new FormControl(this.form.nombreUsuario, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(this.form.password, [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  get nombreUsuario() {
    return this.formulario.get('nombreUsuario')!;
  }
  get password() {
    return this.formulario.get('password')!;
  }

  enviar() {
    let modelo: LoginRequest = {
      nombreUsuario: this.formulario.value.nombreUsuario,
      password: this.formulario.value.password,
    };

    this.service.login(modelo).subscribe({
      next: (data) => {
        if (data.mensaje == 'Ok') {
          this.cookieService.set('token', data.token, (1 * 6) / 24);
          this.cookieService.set(
            'nombreUsuario',
            data.nombreUsuario,
            (1 * 6) / 24
          );
          this.cookieService.set(
            'documentoProfesional',
            data.documentoProfesional,
            (1 * 6) / 24
          );
          this.cookieService.set('rucFilial', data.rucFilial, (1 * 6) / 24);
          this.cookieService.set(
            'codigoSucursal',
            data.codigoSucursal,
            (1 * 6) / 24
          );
          this.cookieService.set(
            'nombreCompleto',
            data.nombreCompleto,
            (1 * 6) / 24
          );
          this.cookieService.set('rol', data.rol, (1 * 6) / 24);

          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido/a ' + data.nombreCompleto,
            color: '#85586F',
            iconColor: '#333',
          })
            .then(() => {
              this.router.navigate(['']).then(() => {
                window.location.reload();
              });
            })
            .then(() => {
              this.router.navigate(['home']).then(() => {
                window.location.reload();
              });
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'Usuario o contraseña incorrectos',
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error ',
          text: 'Usuario o contraseña incorrectos',
        });
      },
    });
  }
}
