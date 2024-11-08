export class Trabajador {
  constructor(
      public id: number,
      public documento: string,
      public nombre: string,
      public apellido: string,
      public email: string,
      public nombreUsuario: string,
      public password:string,
      public rol: string,
      public telefonos: [],
      public direcciones: [],
      public idTipoUsuario: number
  ){}
}
