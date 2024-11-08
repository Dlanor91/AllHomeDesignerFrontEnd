export class Precio {
   constructor(
      public precioLista: number,
      public precioVenta: number,
      public iva: number,
      public precioFinal: number,
      public simbolo: string,
   ) {}
}
