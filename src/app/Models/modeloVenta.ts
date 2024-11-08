export class Venta {
  constructor(
      public codigo: string,
      public fechaCompra: Date,
      public nombreCliente: string,
      public apellidoCliente: string,
      public nombreEmpresa:string,
      public razonSocialEmpresa: string,
      public totalPesos:number,
      public totalDolares:number,
  ){}
}
