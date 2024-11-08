import { Persona } from "./modeloCliente";

export class ClienteRegistro {
   constructor(
    public id: number,
    public documentoCliente: string,
    public nombreCliente: string,
    public apellidoCliente: string,
    public emailCliente: string,
    public persona: Persona
      
   ) {}
}