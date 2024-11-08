import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/Models/modeloProducto';
import { Categoria } from 'src/app/Models/modeloCategoria';
import { ProductosServices } from 'src/app/services/productos.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { Compra } from 'src/app/Models/modeloCompra';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [ProductosServices, CategoriaService, CarritoService],
})
export class ProductoComponent implements OnInit {
  public productos: Producto[];
  public unProducto: Producto;
  public productosFiltrados: Producto[];
  public categorias: Categoria[];
  public encontrado: boolean;
  public buscarProducto: string;
  public categoriaNombre: string;

  public carritoCompras: Compra[] = [];

  logueado: boolean;
  rol: string;
  rucFilial: string;

  constructor(
    private cookieService: CookieService,
    private _productoServices: ProductosServices,
    private _categoriaServices: CategoriaService,
    private _carritoService: CarritoService,
    private router: Router
  ) {
    this.encontrado = false;
    this.buscarProducto = '';
    this.categoriaNombre = '';
  }

  ngOnInit(): void {
    this.getCategorias();
    this.getCompras();
    if (this.cookieService.check('token')) {
      this.rol = this.cookieService.get('rol');
      this.rucFilial = this.cookieService.get('rucFilial');
      if (this.rucFilial == 'null') {
        this.getProductos();
      } else {
        this.getProductosByRucFilial(this.rucFilial);
      }
    } else {
      this.logueado = false;
    }
  }

  //#region Datos desde la API o LocalStorage
  getProductos() {
    this._productoServices.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al obtener los datos de los productos',
        });
      }
    );
  }

  getProductosByRucFilial(rucFilial: string) {
    this._productoServices.getProductosByFilial(rucFilial).subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al obtener los datos de los productos por filial.',
        });
      }
    );
  }

  mostrarInfoProducto(codigo: string, rucProveedor: string): void {
    this._productoServices.getProductoByCodigo(codigo, rucProveedor).subscribe(
      (data: Producto) => {
        this.unProducto = data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al obtener los datos de un producto',
        });
      }
    );
  }

  getCategorias() {
    this._categoriaServices.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Error al obtener los datos de una categoría.',
        });
      }
    );
  }

  getCompras(): void {
    const compras = localStorage.getItem('miCarrito');
    if (compras) {
      this.carritoCompras = JSON.parse(compras);
    } else {
      this.carritoCompras = [];
    }
  }

  //#endregion

  //#region Filtrado de productos
  filtrarProductos() {
    if (this.buscarProducto.length > 0 && this.categoriaNombre != '') {
      this.productosFiltrados = this.productos.filter(
        (product) =>
          product.nombre
            .toLowerCase()
            .includes(this.buscarProducto.toLowerCase()) &&
          product.nombreCategoria
            .toLowerCase()
            .includes(this.categoriaNombre.toLowerCase())
      );
      if (this.productosFiltrados.length > 0) {
        this.encontrado = true;
      }
    } else if (this.buscarProducto.length > 0 && this.categoriaNombre == '') {
      this.productosFiltrados = this.productos.filter((product) =>
        product.nombre.toLowerCase().includes(this.buscarProducto.toLowerCase())
      );
      if (this.productosFiltrados.length > 0) {
        this.encontrado = true;
      }
    } else if (this.buscarProducto.length == 0 && this.categoriaNombre != '') {
      this.productosFiltrados = this.productos.filter((product) =>
        product.nombreCategoria
          .toLowerCase()
          .includes(this.categoriaNombre.toLowerCase())
      );
      if (this.productosFiltrados.length > 0) {
        this.encontrado = true;
      }
    } else {
      this.encontrado = false;
    }
  }

  detalle(codigo: string, rucProveedor: string) {
    this.router.navigate(['/editarProductos/', codigo, rucProveedor]);
  }
  //#endregion

  //#region Carrito

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

  eliminarCompra(compra: Compra) {
    for (let i in this.carritoCompras) {
      if (this.carritoCompras[i].producto.codigo == compra.producto.codigo) {
        this.carritoCompras.splice(parseInt(i), 1);
      }
    }
    if (this.carritoCompras.length > 0) {
      this._carritoService.setCarrito(this.carritoCompras);
      this._carritoService.guardarEnLocalStorage();
    } else {
      this._carritoService.setCarrito([]);
      localStorage.removeItem('miCarrito');
    }
  }

  calcularPrecioFinalCompra(compra: Compra): any {
    if (compra.producto.rendimiento) {
      return (
        compra.producto.precio.simbolo +
        ' ' +
        (
          compra.producto.precio.precioFinal *
          compra.producto.rendimiento *
          (compra.cantidad ? compra.cantidad : 1)
        ).toFixed(1)
      );
    } else {
      return (
        compra.producto.precio.simbolo +
        ' ' +
        (
          compra.producto.precio.precioFinal *
          (compra.cantidad ? compra.cantidad : 1)
        ).toFixed(1)
      );
    }
  }

  //#endregion

  irCompras(): void {
    this.router.navigate(['/reservas']);
  }
}
