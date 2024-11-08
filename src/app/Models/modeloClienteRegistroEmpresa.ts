import { Empresa } from "./modeloEmpresa";

export class ClienteRegistroEmpresa {
   constructor(
      public id: number,
      public rucEmpresaCliente: string,
      public nombreEmpresa: string,
      public razonSocialEmpresa: string,
      public emailEmpresa: string,
      public empresa: Empresa,
   ) {}
}
