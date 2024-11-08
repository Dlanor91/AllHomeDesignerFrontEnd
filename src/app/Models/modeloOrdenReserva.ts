export class OrdenReserva {
   constructor(
    public rucProveedor:string,
    public cantidad: number,
    public codigoProducto: string,
    public precioFinal: number,
    public precioProducto: number,
    public simboloMoneda: string,
   ) {}
}
