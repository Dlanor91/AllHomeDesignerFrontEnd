import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ImagenesProductos } from 'src/app/Models/modeloImagenesProducto';
import { ProductosServices } from 'src/app/services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'cargaMasivaDatos',
  templateUrl: './cargaMasivaDatos.component.html',
  styleUrls: ['./cargaMasivaDatos.component.css'],
})
export class CargaMasivaDatosComponent implements OnInit {
  fotos: File[] = [];
  fotosSubir: FormData;
  rucFilial: string;

  constructor(
    private _productosService: ProductosServices,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.rucFilial = this.cookieService.get('rucFilial');
  }

  //#endregion

  //#region Acciones

  personasSeleccionadas(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const contents = fileReader.result as string;
        console.log('Contenido del archivo:', contents);
        // Realiza acciones con el contenido del archivo
      };
      fileReader.readAsText(file);
    }
  }

  empresasSeleccionadas(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const contents = fileReader.result as string;
        console.log('Contenido del archivo:', contents);
        // Realiza acciones con el contenido del archivo
      };
      fileReader.readAsText(file);
    }
  }

  productosSeleccionados(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const contents = fileReader.result as string;
        console.log('Contenido del archivo:', contents);
        // Realiza acciones con el contenido del archivo
      };
      fileReader.readAsText(file);
    }
  }

  fotosSeleccionadas(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        this.fotos.push(files[i]);
      }

      for (let i = 0; i < this.fotos.length; i++) {
        const nombreCampo = `foto_${i}`;
        formData.append(nombreCampo, this.fotos[i], this.fotos[i].name);
      }
      this.fotosSubir = formData;
      formData.forEach((archivo, nombreCampo) => {
        console.log(`Campo: ${nombreCampo}, Archivo:`, archivo);
      });
    }
  }

  //#endregion
}
