import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Categoria } from 'src/app/Models/modeloCategoria';
import { Moneda } from 'src/app/Models/modeloMoneda';
import { Proveedor } from 'src/app/Models/modeloProveedor';
import { PrecioRequest } from 'src/app/interfaces/precio-request';
import { ProductoRequest } from 'src/app/interfaces/producto-request';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { PrecioService } from 'src/app/services/precio.service';
import { ProductosServices } from 'src/app/services/productos.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-producto',
  templateUrl: './registrar-producto.component.html',
  styleUrls: ['./registrar-producto.component.css'],
})
export class RegistrarProductoComponent implements OnInit {
  rucFilial: string;
  proveedores: Proveedor[];
  categorias: Categoria[];
  monedas: Moneda[];
  formulario!: FormGroup;

  form = {
    codigo: '',
    nombre: '',
    descripcion: '',
    largo: 0,
    ancho: 0,
    profundidad: 0,
    stock: 0,
    presentacion: '',
    rendimiento: 0,
    textura: '',
    sugerencias: '',
    rucProveedor: '',
    idCategoria: 0,
    precioLista: 0,
    precioVenta: 0,
    iva: 0,
  };

  seleccionProveedor: Proveedor = {
    id: 0,
    nombre: '',
    ruc: '',
  };

  seleccionCategoria: Categoria = {
    id: 0,
    nombre: '',
    descripcion: '',
  };

  seleccionMoneda: Moneda = {
    id: 0,
    codigo: '',
    descripcion: '',
    cotizacion: 0,
    fecha: new Date(),
    simbolo: '',
  };
  constructor(
    private _categoriaServices: CategoriaService,
    private _proveedorServices: ProveedorService,
    private _productosServices: ProductosServices,
    private _monedaService: MonedaService,
    private _precioService: PrecioService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.rucFilial = this.cookieService.get('rucFilial');
    this.getCategorias();
    this.getProveedores();
    this.getMonedas();

    this.formulario = new FormGroup({
      codigo: new FormControl(this.form.codigo, [Validators.required]),
      nombre: new FormControl(this.form.nombre, [
        Validators.required,
        Validators.minLength(3),
      ]),
      descripcion: new FormControl(this.form.descripcion, [
        Validators.required,
        Validators.minLength(10),
      ]),
      largo: new FormControl(this.form.largo, [
        Validators.required,
        Validators.min(1),
      ]),
      ancho: new FormControl(this.form.ancho, [
        Validators.required,
        Validators.min(1),
      ]),
      profundidad: new FormControl(this.form.profundidad, [
        Validators.required,
        Validators.min(0),
      ]),
      stock: new FormControl(this.form.stock, [
        Validators.required,
        Validators.min(1),
      ]),
      presentacion: new FormControl(this.form.presentacion, [
        Validators.required,
        Validators.minLength(10),
      ]),
      rendimiento: new FormControl(this.form.rendimiento, [Validators.min(0)]),
      textura: new FormControl(this.form.textura, []),
      sugerencias: new FormControl(this.form.sugerencias, []),

      idCategoria: new FormControl(this.seleccionCategoria.id, [
        Validators.required,
      ]),
      rucProveedor: new FormControl(this.seleccionProveedor.ruc, [
        Validators.required,
      ]),

      precioLista: new FormControl(this.form.precioLista, [
        Validators.required,
        Validators.min(1),
      ]),
      precioVenta: new FormControl(this.form.precioVenta, [
        Validators.required,
        Validators.min(1),
      ]),
      iva: new FormControl(this.form.iva, [Validators.required]),
      codigoMoneda: new FormControl(this.seleccionMoneda.simbolo, [
        Validators.required,
        Validators.min(0),
      ]),
    });
  }

  get codigo() {
    return this.formulario.get('codigo')!;
  }
  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get descripcion() {
    return this.formulario.get('descripcion')!;
  }
  get largo() {
    return this.formulario.get('largo')!;
  }
  get ancho() {
    return this.formulario.get('ancho')!;
  }
  get profundidad() {
    return this.formulario.get('profundidad')!;
  }
  get stock() {
    return this.formulario.get('stock')!;
  }
  get presentacion() {
    return this.formulario.get('presentacion')!;
  }
  get rendimiento() {
    return this.formulario.get('rendimiento')!;
  }
  get textura() {
    return this.formulario.get('textura')!;
  }
  get sugerencias() {
    return this.formulario.get('sugerencias')!;
  }
  get rucProveedor() {
    return this.formulario.get('rucProveedor')!;
  }
  get idCategoria() {
    return this.formulario.get('idCategoria')!;
  }
  get precioLista() {
    return this.formulario.get('precioLista')!;
  }
  get precioVenta() {
    return this.formulario.get('precioVenta')!;
  }
  get iva() {
    return this.formulario.get('iva')!;
  }
  get codigoMoneda() {
    return this.formulario.get('codigoMoneda')!;
  }

  //#region Acciones API
  getProveedores() {
    this._proveedorServices.getProveedor().subscribe(
      (data: Proveedor[]) => {
        this.proveedores = data;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos de los proveedores.',
        });
      }
    );
  }

  getCategorias() {
    this._categoriaServices.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos de las categorias.',
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

  registrar() {
    if (this.formulario.value.stock <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Stock negativo o 0.',
        text: 'El stock ingresado no puede ser ni negativo, ni menor que 0.',
      });
    } else {
      let modeloProd: ProductoRequest = {
        codigo: this.formulario.value.codigo,
        nombre: this.formulario.value.nombre,
        descripcion: this.formulario.value.descripcion,
        largo: this.formulario.value.largo,
        ancho: this.formulario.value.ancho,
        profundidad: this.formulario.value.profundidad,
        stock: this.formulario.value.stock,
        presentacion: this.formulario.value.presentacion,
        rendimiento: this.formulario.value.rendimiento,
        textura: this.formulario.value.textura,
        sugerencias: this.formulario.value.sugerencias,
        rucFilial: this.rucFilial,
        rucProveedor: this.formulario.value.rucProveedor.ruc,
        idCategoria: this.formulario.value.idCategoria.id,
      };

      this._productosServices
        .registrarProducto(modeloProd, this.rucFilial)
        .subscribe({
          next: (data) => {
            if (data != null) {
              this.registrarPrecio();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ups! ',
                text: data,
              });
            }
          },
          error: (error) => {
            if (error.status === 409) {
              Swal.fire({
                icon: 'error',
                title: 'Código de producto ya registrado.',
                text:
                  'El código de producto: ' +
                  modeloProd.codigo +
                  ', ya se encuentra registrado en el proveedor seleccionado.',
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

  registrarPrecio() {
    let modeloPrecio: PrecioRequest = {
      precioLista: this.formulario.value.precioLista,
      precioVenta: this.formulario.value.precioVenta,
      iva: this.formulario.value.iva,
      codigoMoneda: this.formulario.value.codigoMoneda.codigo,
      rucProveedor: this.formulario.value.rucProveedor.ruc,
      codigoProducto: this.formulario.value.codigo,
    };

    this._precioService.registroPrecio(modeloPrecio).subscribe({
      next: (data) => {
        if (data != null) {
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Producto registrado con éxito.',
          });
          this.router.navigate(['/listarProductos']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups! ',
            text: data,
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Ups! ',
          text: 'Se produjo un error',
        });
      },
    });
  }

  //#endregion
}
