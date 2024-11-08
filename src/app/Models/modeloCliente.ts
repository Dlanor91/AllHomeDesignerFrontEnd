export class Persona {
    constructor(
        public id: number,
        public documento: string,
        public nombre: string,
        public apellido: string,
        public email: string,
        public telefonos: [],
        public direcciones: [],
        public idTipoPersona: number
    ){}
}