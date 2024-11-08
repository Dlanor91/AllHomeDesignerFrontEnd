export class Empresa {
    constructor(
        public id: number,
        public ruc: string,
        public nombre: string,
        public razonSocial: string,
        public email: string,
        public telefonos: [],
        public direcciones: [],
        public idTipoPersona: number
    ){}
}