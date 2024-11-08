import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Compra } from '../../Models/modeloCompra';
import { Persona } from '../../Models/modeloCliente';
import { Empresa } from '../../Models/modeloEmpresa';
import { OrdenReserva } from 'src/app/Models/modeloOrdenReserva';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { ClienteRegistroService } from 'src/app/services/cliente-registro.service';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
  providers: [CarritoService, PersonaService],
})
export class CompraComponent implements OnInit {
  public carritoCompras: Compra[];
  public carritoComprasAPI: OrdenReserva[] = [];
  public clientes: Persona[];
  public totalPesos: number = 0;
  public totalDolares: number = 0;
  public consumidor: Persona; //Persona que efectua la compra
  public consumidorEmpresa: Empresa; //Empresa que efectua la compra
  public documento: string;
  public deseaRegistrarse: boolean;
  public consumidorEncontrado: boolean;
  public tipoCliente: string;
  public rucFilial: string;
  public documentoProfesional: string;

  constructor(
    private _carritoService: CarritoService,
    private _personaService: PersonaService,
    private _empresaService: EmpresaService,
    private _clienteRegistroService: ClienteRegistroService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rucFilial = this.cookieService.get('rucFilial');
    this.documentoProfesional = this.cookieService.get('documentoProfesional');
    this.getCompras();
    this.calculoTotalCompras();
    this.calculoTotalComprasDolares();
    this.getClientes();
    this.consumidorEncontrado = false;
  }

  getCompras(): void {
    const compras = localStorage.getItem('miCarrito');
    if (compras) {
      this.carritoCompras = JSON.parse(compras);
    } else {
      this.carritoCompras = [];
    }
  }

  getClientes(): void {
    this._personaService.getAllPersona().subscribe((data: Persona[]) => {
      this.clientes = data;
    });
  }

  getConsumidorByDocumento(documento: string): void {
    this._personaService
      .getPersonaByDocumento(documento)
      .subscribe((data: Persona) => {
        this.consumidor = data;
      });
  }

  getConsumidorEmpresaByRuc(ruc: string): void {
    this._empresaService.getEmpresaByRuc(ruc).subscribe((data: Empresa) => {
      this.consumidorEmpresa = data;
    });
  }

  getVerificarClientes(
    documentoProfesional: string,
    rucFilial: string,
    documentoCliente: string
  ) {
    this._clienteRegistroService
      .getVerificarCliente(documentoProfesional, rucFilial, documentoCliente)
      .subscribe(
        (data) => {
          if (data == null) {
            this.consumidorEncontrado = true;
            this.getConsumidorByDocumento(documentoCliente);
            Swal.fire({
              icon: 'success',
              title: 'Cliente ya registrado',
              text: 'Puede efectuar la venta.',
              color: '#85586F',
              iconColor: '#333',
            });
          }
        },
        (error: any) => {
          if (error.status === 404) {
            Swal.fire(`Debe registrar al cliente.`, '', 'info');
          }
        }
      );
  }

  getVerificarEmpresas(
    documentoProfesional: string,
    rucFilial: string,
    rucEmpresa: string
  ) {
    this._clienteRegistroService
      .getVerificarEmpresa(documentoProfesional, rucFilial, rucEmpresa)
      .subscribe(
        (data) => {
          if (data == null) {
            this.consumidorEncontrado = true;
            this.getConsumidorEmpresaByRuc(rucEmpresa);
            Swal.fire({
              icon: 'success',
              title: 'Empresa ya registrada',
              text: 'Puede efectuar la venta',
              color: '#85586F',
              iconColor: '#333',
            });
          }
        },
        (error: any) => {
          if (error.status === 404) {
            Swal.fire(`Debe registrar dicha empresa.`, '', 'info');
          }
        }
      );
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
      this.calculoTotalCompras();
      this.calculoTotalComprasDolares();
    } else {
      this._carritoService.setCarrito([]);
      localStorage.removeItem('miCarrito');
    }
  }

  finalizarCompra(unTipo: String): void {
    this.carritoCompras.forEach((compra) => {
      const orden: OrdenReserva = {
        rucProveedor: compra.producto.rucProveedor,
        cantidad: compra.cantidad ? compra.cantidad : 1,
        codigoProducto: compra.producto.codigo,
        precioFinal: this.calculaPrecioFinal(compra),
        precioProducto: compra.producto.precio.precioFinal,
        simboloMoneda: compra.producto.precio.simbolo,
      };
      this.carritoComprasAPI.push(orden);
    });
    if (this.consumidorEncontrado && unTipo == 'Persona') {
      this._carritoService
        .generarOrdenReservaCliente(
          this.consumidor.documento,
          this.rucFilial,
          this.documentoProfesional,
          this.carritoComprasAPI
        )
        .subscribe({
          next: (data) => {
            if (data == null) {
              Swal.fire({
                icon: 'success',
                title: 'Reserva Realizada',
                text: 'Felicidades su reserva fue todo un éxito.',
                color: '#85586F',
                iconColor: '#333',
              });
              this.vaciarCarrito();
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
    } else {
      this._carritoService
        .generarOrdenReservaEmpresa(
          this.consumidorEmpresa.ruc,
          this.rucFilial,
          this.documentoProfesional,
          this.carritoComprasAPI
        )
        .subscribe({
          next: (data) => {
            if (data == null) {
              Swal.fire({
                icon: 'success',
                title: 'Compra Realizada',
                text: 'Felicidades su compra fue todo un éxito.',
                color: '#85586F',
                iconColor: '#333',
              });
              this.vaciarCarrito();
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
  }

  calculaPrecioFinal(compra: Compra): number {
    let resultado = 0;
    if (compra.producto.rendimiento > 0) {
      resultado =
        compra.producto.rendimiento *
        compra.producto.precio.precioFinal *
        (compra.cantidad ? compra.cantidad : 1);
    } else {
      resultado =
        compra.producto.precio.precioFinal *
        (compra.cantidad ? compra.cantidad : 1);
    }
    return resultado;
  }

  cancelarCompra(): void {
    if (
      confirm(
        'Desea cancelar la compra? Se perderán todos los productos cargados'
      )
    ) {
      this.vaciarCarrito();
    }
  }

  vaciarCarrito(): void {
    this._carritoService.eliminarLocalStorage();
    this.carritoCompras = [];
    this.totalPesos = 0;
    this.totalDolares = 0;
  }

  calculoTotalCompras(): number {
    let total = 0;
    this.carritoCompras.forEach((compra) => {
      if (compra.producto.rendimiento < 1 || !compra.producto.rendimiento) {
        total +=
          compra.producto.precio.precioFinal *
          (compra.cantidad ? compra.cantidad : 1);
      }
    });
    this.totalPesos = this.redondeo(total, 2);
    return this.totalPesos;
  }

  calculoTotalComprasDolares(): number {
    let total = 0;
    this.carritoCompras.forEach((compra) => {
      if (compra.producto.rendimiento > 0) {
        total +=
          compra.producto.precio.precioFinal *
          compra.producto.rendimiento *
          (compra.cantidad ? compra.cantidad : 1);
      }
    });
    this.totalDolares = this.redondeo(total, 2);
    return this.totalDolares;
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

  redondeo(number: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(number * multiplier) / multiplier;
  }

  irProductos(): void {
    this.router.navigate(['/Productos']);
  }

  encontrarCliente(unDocumento: string, unTipo: string): any {
    if (unDocumento == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: 'El documento/Ruc no puede estar vacío.',
      });
    } else {
      if (unTipo == 'Persona') {
        this.consumidorEncontrado = false;
        this.getVerificarClientes(
          this.documentoProfesional,
          this.rucFilial,
          unDocumento
        );
        //return this.consumidor;
      } else {
        this.consumidorEncontrado = false;
        this.getVerificarEmpresas(
          this.documentoProfesional,
          this.rucFilial,
          unDocumento
        );
      }
    }
  }

  enviarARegistro(unTipo: string): void {
    if (unTipo == null) {
      Swal.fire(
        `Debe seleccionar un tipo de cliente para registrar`,
        '',
        'info'
      );
      this.deseaRegistrarse = false;
    } else {
      if (unTipo == 'Persona') {
        this.router.navigate(['/registroCliente']);
      } else if (unTipo == 'Empresa') {
        this.router.navigate(['/registroEmpresa']);
      }
    }
  }

  crearPresupuesto(unTipo: string): void {
    if (unTipo == null) {
      Swal.fire(
        `Debe seleccionar un tipo de cliente para registrar'`,
        '',
        'info'
      );
    } else {
      var total = 0;
      var doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Presupuesto Venta de Productos', 10, 10);
      const currentDate = new Date();
      var fecha = `Fecha: ${currentDate
        .getDate()
        .toString()
        .padStart(2, '0')}/${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${currentDate.getFullYear()}`;
      var textWidth = doc.getStringUnitWidth(fecha) * doc.internal.scaleFactor;
      var positionX = doc.internal.pageSize.width - textWidth - 35;
      doc.text(fecha, positionX, 10);
      doc.setFontSize(14);
      if (unTipo == 'Persona') {
        doc.text(
          `Cliente: ${this.consumidor.nombre + ' ' + this.consumidor.apellido}`,
          10,
          19
        );
        doc.setFontSize(13);
        doc.text(`Documento: ${this.consumidor.documento}`, 10, 25);
      } else {
        doc.text(`Cliente: ${this.consumidorEmpresa.razonSocial}`, 10, 19);
        doc.setFontSize(13);
        doc.text(`RUC: ${this.consumidorEmpresa.ruc}`, 10, 25);
      }
      var y = 27;
      this.carritoCompras.forEach((compra: Compra) => {
        doc.setFontSize(12);
        doc.text(compra.producto.nombre, 10, (y += 7));
        doc.text(`Filial: ${compra.producto.nombreFilial}`, 10, (y += 7));
        doc.text(`Código: ${compra.producto.codigo}`, 10, (y += 7));
        doc.setFontSize(10);
        if (compra.producto.precio.simbolo == '$') {
          doc.text(`Cantidad: ${compra.cantidad}`, 10, (y += 7));
          doc.text(
            `Precio: $ ${compra.producto.precio.precioFinal}`,
            10,
            (y += 7)
          );
          if (compra.cantidad != null)
            total = compra.producto.precio.precioFinal * compra.cantidad;
          doc.text(`Total: $ ${total}`, 10, (y += 7));
        } else {
          doc.text(`Cantidad: ${compra.cantidad}`, 10, (y += 7));
          doc.text(
            `Precio: U$S ${compra.producto.precio.precioFinal} / m2`,
            10,
            (y += 7)
          );
          if (compra.cantidad != null)
            total =
              compra.producto.precio.precioFinal *
              compra.cantidad *
              compra.producto.rendimiento;
          const formattedTotal = total.toFixed(2);
          doc.text(`Total: U$S ${formattedTotal} `, 10, (y += 7));
        }

        doc.line(10, (y += 5), 200, y);
        if ((y = y + 42) >= 280) {
          doc.addPage();
          y = 10;
        } else {
          y = y - 37;
        }
      });
      doc.setFontSize(14);
      doc.text(`Total a pagar: $ ${ this.totalPesos } / U$S ${ this.totalDolares }`, 10, (y += 7));
      if (unTipo == 'Persona') {
        doc.save(`${this.consumidor.nombre}_${fecha}.pdf`);
      } else {
        doc.save(`${this.consumidorEmpresa.razonSocial}_${fecha}.pdf`);
      }
    }
  }
}
