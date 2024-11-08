import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Compra } from 'src/app/Models/modeloCompra';
import { Moneda } from 'src/app/Models/modeloMoneda';
import { Producto } from 'src/app/Models/modeloProducto';
import { PrecioRequest } from 'src/app/interfaces/precio-request';
import { CarritoService } from 'src/app/services/carrito.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { PrecioService } from 'src/app/services/precio.service';
import { ProductosServices } from 'src/app/services/productos.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.component.html',
  styleUrls: ['./edit-productos.component.css'],
})
export class EditProductosComponent implements OnInit {
  cod: string = '';
  rucProveedor: string = '';
  rol: string;
  monedas: Moneda[];
  producto: Producto;
  nombre: string;
  isLoading: boolean = false;
  bearer: string;
  accionSubirFoto: boolean = false;
  accionIngresarPrecio: boolean = false;
  ruta: string;
  public carritoCompras: Compra[] = [];

  formulario!: FormGroup;

  form = {
    precioLista: '',
    precioVenta: '',
    iva: '',
    simbolo: '',
  };

  get precioLista() {
    return this.formulario.get('precioLista')!;
  }
  get precioVenta() {
    return this.formulario.get('precioVenta')!;
  }
  get iva() {
    return this.formulario.get('iva')!;
  }
  get simbolo() {
    return this.formulario.get('simbolo')!;
  }

  constructor(
    private _productosServices: ProductosServices,
    private _precioServices: PrecioService,
    private _monedaService: MonedaService,
    private _carritoService: CarritoService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    environment.api;
    this.ruta = environment.api;
  }

  ngOnInit(): void {
    this.getCompras();
    this.rol = this.cookieService.get('rol');
    this.bearer = 'Bearer ' + this.cookieService.get('token');
    this.route.paramMap.subscribe((params) => {
      const codigo = params.get('codigo');
      const rucProveedor = params.get('rucProveedor');

      if (codigo !== null) {
        this.cod = codigo;
      }

      if (rucProveedor !== null) {
        this.rucProveedor = rucProveedor;
      }
    });
    this.getDetallesProducto(this.cod, this.rucProveedor);
    this.formulario = new FormGroup({
      precioLista: new FormControl(this.form.precioLista, [
        Validators.required,
      ]),
      precioVenta: new FormControl(this.form.precioVenta, [
        Validators.required,
      ]),

      iva: new FormControl(this.form.iva, [Validators.required]),
      simbolo: new FormControl(this.form.simbolo, [Validators.required]),
    });
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      const headers = new HttpHeaders({
        Authorization: this.bearer,
      });

      this.http
        .put(
          `${this.ruta}/Producto/${this.producto.codigo}/${this.producto.rucProveedor}`,
          formData,
          { headers }
        )
        .subscribe((response) => {
          location.reload();
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar un archivo.',
      });
    }
  }

  //#region Acciones Api
  getDetallesProducto(codigo: string, rucProveedor: string) {
    this._productosServices.getProductoByCodigo(codigo, rucProveedor).subscribe(
      (data: Producto) => {
        this.producto = data;
        this.nombre = this.producto.nombre;
        this.isLoading = true;
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

  getMonedas() {
    this._monedaService.getMonedas().subscribe(
      (data: Moneda[]) => {
        this.monedas = data;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos de las monedas.',
        });
      }
    );
  }

  ingresarPrecio() {
    let modelo: PrecioRequest = {
      precioLista: this.formulario.value.precioLista,
      precioVenta: this.formulario.value.precioVenta,
      iva: this.formulario.value.iva,
      codigoMoneda: this.formulario.value.simbolo,
      codigoProducto: this.producto.codigo,
      rucProveedor: this.producto.rucProveedor,
    };

    this._precioServices.registroPrecio(modelo).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Registro con éxito',
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        }
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'No se pudo ingresar el precio.',
          });
        };
      },
    });
  }

  //#endregion

  //#region  Acciones
  atras() {
    this.router.navigate(['/listarProductos']);
  }
  getCompras(): void {
    const compras = localStorage.getItem('miCarrito');
    if (compras) {
      this.carritoCompras = JSON.parse(compras);
    } else {
      this.carritoCompras = [];
    }
  }
  onClickComprar(prod: Producto) {
    var compra: Compra = new Compra(prod, 0, new Date());
    var numero = prompt('Ingrese la cantidad a reservar: ');
    if (numero !== null) {
      if (!isNaN(Number(numero))) {
        if (Number(numero) <= prod.disponibilidad) {
          compra.cantidad = Number(numero);
          this.carritoCompras.push(compra);
          this._carritoService.setCarrito(this.carritoCompras);
          this._carritoService.guardarEnLocalStorage();
          Swal.fire({
            icon: 'success',
            title: 'Reserva realizada',
            text:
              'Producto: ' + prod.nombre + ', reservado satisfactoriamente.',
            color: '#85586F',
            iconColor: '#333',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Disponibilidad insuficiente',
            text: `No disponemos de suficiente inventario en este momento. Tenemos un total de ${prod.disponibilidad} unidades disponibles del producto ${prod.nombre}.`,
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `La cantidad ingresada debe ser un número.`,
        });
      }
    }
  }

  subirFoto() {
    this.accionSubirFoto = true;
    this.accionIngresarPrecio = false;
  }

  habilitarIngresarPrecio() {
    this.getMonedas();
    this.accionSubirFoto = false;
    this.accionIngresarPrecio = true;
  }
  //#endregion
}
