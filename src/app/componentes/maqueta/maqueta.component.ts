import { Component, OnInit } from '@angular/core';
import { opcionesRender } from 'src/app/Models/modeloOpcionRender';

@Component({
  selector: 'app-maqueta',
  templateUrl: './maqueta.component.html',
  styleUrls: ['./maqueta.component.css']
})
export class MaquetaComponent implements OnInit {


  constructor() { }
  tipoRender: string;
  caracteristicaRender: string;
  colorRender: string;
  tipoSeleccionado: boolean;
  caracteristicaSeleccionada: boolean;
  colorSeleccionado: boolean;

  opcionesAmbientes: opcionesRender[]
  opcionesRender: opcionesRender[]
  opcionesRenderColor: opcionesRender[]

  opcionesFiltradas: opcionesRender[] = []
  detalleFiltrado: opcionesRender[] = []

  ngOnInit(): void {
    this.tipoSeleccionado = false;
    this.caracteristicaSeleccionada = false;
    this.colorSeleccionado = false;

    this.opcionesRender = [];
    this.opcionesRenderColor = [];
    this.opcionesAmbientes = [];

    this.cargarAmbientes();
    this.cargarOpcionesRender();
    this.cargarDetallesRender();
  }

  // Cargo los ambientes disponibles para el renderizado
  cargarAmbientes(): void {
    this.opcionesAmbientes.push(
      {codigo:'habitacion', nombre:'Habitación', ambiente: 'habitacion'}
      , {codigo:'pared',nombre:'Pared', ambiente: 'pared'}
      , {codigo:'piso', nombre:'Piso', ambiente: 'piso'}
      )    
  }

  // Cargo las opciones para cada ambiente
  cargarOpcionesRender(): void {
    this.opcionesRender.push(
      {codigo:"Pared_Ladrillo", nombre: "Ladrillo", ambiente: 'pared'}
      , {codigo:"Pared_Madera", nombre: "Madera", ambiente: 'pared'}
      , {codigo:"Pared_Parquet", nombre: "Madera Beteada", ambiente: 'pared'}
      , {codigo:"Pared_Marmol", nombre: "Marmol", ambiente: 'pared'}
      , {codigo:"Pared_Piedra", nombre: "Piedra", ambiente: 'pared'}
      , {codigo:"Pared_Ticholo", nombre: "Ticholo", ambiente: 'pared'}
      , {codigo: "juegoMesa", nombre: "Juego de Mesa", ambiente: 'habitacion'}
      , {codigo:"Ceramica_Medieval", nombre: "Beteada", ambiente: 'piso'}
      , {codigo:"Ceramica_Madera", nombre: "Madera Clara", ambiente: 'piso'}
      )
  }

  // Cargo los detalles de los ambientes
  cargarDetallesRender(): void {
    this.opcionesRenderColor.push(
      {codigo: "Rojo", nombre: "Rojo", ambiente: 'juegoMesa'}
      , {codigo: "Blanco", nombre: "Blanco", ambiente: 'juegoMesa'})
  }

  filtroOpciones(unAmbiente: string): any { 
   
    this.opcionesFiltradas = []
    this.tipoSeleccionado = false;
    this.caracteristicaSeleccionada = false;
    this.colorSeleccionado = false;

    this.caracteristicaRender = ''
    this.colorRender = ''

    this.opcionesRender.forEach(element => {
      if (element.ambiente == unAmbiente) {
        this.opcionesFiltradas.push(element)
      }
    });
  }

  filtroDetallesRender(unDetalle: string): void {
    this.detalleFiltrado = []
    this.opcionesRenderColor.forEach(element => {
      if (element.ambiente == unDetalle) {
        this.detalleFiltrado.push(element)
      }
    });
  }

  cargarModelo(): void {
    if (this.colorRender != '') {
      this.tipoSeleccionado = true;
      this.caracteristicaSeleccionada = true;
      this.colorSeleccionado = true;
      
    }
    else {
      this.tipoSeleccionado = true;
      this.caracteristicaSeleccionada = true;
    }  
  }

  reseteoColor(): void {
    this.colorSeleccionado = false;
  }
  
  reseteoAmbiente(): void {
    this.caracteristicaSeleccionada = false;
  }
  
}
