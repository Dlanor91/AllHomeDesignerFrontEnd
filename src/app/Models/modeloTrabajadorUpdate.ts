export class TrabajadorUpdate {
  constructor(
      public nombre: string,
      public apellido: string,
      public email: string,
      public nombreUsuario: string,
      public password: string,
      public idTipoUsuario: number
  ){}
}
