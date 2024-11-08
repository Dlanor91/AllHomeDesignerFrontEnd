export class Direccion {
  constructor(
      public id: number,
      public calle: string,
      public nroPuerta: number,
      public datos: string,
      public complemento: string,
      public departamento: string,
      public nombreLocalidad: string,
  ){}
}
