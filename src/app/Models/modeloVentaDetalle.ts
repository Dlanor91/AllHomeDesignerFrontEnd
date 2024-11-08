export class VentaDetalle {
  constructor(
      public nombreFilial: string,
      public nombreProducto: string,
      public imagenProducto: string,
      public rendimientoProducto:number,
      public precioProducto:number,
      public precioFinal:number,
      public simboloMoneda: string,
      public cantidad:number,
  ){}
}
