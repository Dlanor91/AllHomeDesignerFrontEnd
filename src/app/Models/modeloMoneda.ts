export class Moneda {
   constructor(
      public id: number,
      public codigo: string,
      public descripcion: string,
      public cotizacion: number,
      public fecha: Date,
      public simbolo: string
   ) {}
}